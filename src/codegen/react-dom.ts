import Path from 'path'
import { lowerFirst, camelCase, kebabCase, partition } from 'lodash'
import * as childProcess from 'child_process'

import * as Tree from '../tree'
import { Resource, Message, Var, VarType } from '../parser'

async function main(resources: Array<[string, Promise<Resource>]>, write: (path: string, data: string) => Promise<void>): Promise<void> {
    const outputPaths: string[] = await Promise.all(resources.map(async ([shortPath, pending]) => {
        const resource = await pending

        const parsed = Path.parse(shortPath)
        const namespace = `${kebabCase(Path.join(parsed.dir, parsed.name))}-`
        const [namespacedMsgs, nonNamespacedMsgs] = partition(resource.messages.map(m => m.id), m => m.startsWith(namespace))
        if (namespacedMsgs.length > 0 && nonNamespacedMsgs.length > 0) {
            throw new Error(`Cannot mix namespaced and non-namespaced keys in an ftl file. Namespaces are based on filename; "${shortPath}"'s namespace is "${namespace}".`)
        }
        const isNamespaced = namespacedMsgs.length > 0

        const outputPath = Path.join('localization', parsed.dir, parsed.name)
        // console.log({ parsed, outputPath })
        const output = await prettier(genResource({ messages: resource.messages, shortPath, namespace: isNamespaced ? namespace : null }))
        await write(`${outputPath}.ts`, output)
        return outputPath
    }))
    await write('localization.ts', await prettier(genIndex(outputPaths)))
}

function genIndex(outputPaths: string[]): string {
    const root = Tree.build(outputPaths.map(m => m.split(Path.sep).filter(i => i)))
    const tree = root.nodes.localization
    return (`\
${genHeader}

${outputPaths.map(m => `import * as ${camelCase(m)} from ${JSON.stringify(['.'].concat(m.split(Path.sep)).join('/'))}`).join("\n")}

${genModuleTree(tree)}
`)
}
function genModuleTree(tree: Tree.Node): string {
    const leaves: Array<[string, string]> = tree.leaves.map(l => [l, camelCase(Path.join(...tree.path.concat([l])))])
    const nodes: Array<[string, string]> = Object.entries(tree.nodes).map(([name, n]) => [name, `{${genModuleTree(n)}}`])
    return [...leaves, ...nodes].map(([lval, rval]) => `export const ${lowerFirst(camelCase(lval))} = ${rval}`).join(`,\n${Array((tree.path.length - 1) * 4).fill(' ')}`)
}

async function prettier(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const proc = childProcess.exec("prettier --stdin-filepath localization.ts", {}, (error, stdout, stderr) => {
            if (error) {
                console.error(stderr)
                return reject(error)
            }
            return resolve(stdout)
        })
        if (!proc?.stdin) {
            return reject('failed to spawn prettier')
        }
        // console.error(input)
        const stdin = proc.stdin // make typescript happy
        stdin.write(input, () => {
            stdin.end()
        })
    })
}

const genHeader = '/** File auto-generated by `@erosson/fluent-typesafe`. Do not edit! */'

function genResource(p: { messages: Message[], shortPath: string, namespace: string | null }) {
    const { messages, namespace } = p
    return (`\
${genHeader}

${namespace ? `export const NAMESPACE = ${JSON.stringify(namespace)}` : ''}

export function name_(name: string): {'data-l10n-name': string} {
    return {'data-l10n-name': name}
}

${messages.map(m => genMessage({ message: m, ...p })).join("\n\n")}
`
    )
}
function genMessage(p: { message: Message, shortPath: string, namespace: string | null }) {
    const { message, namespace } = p
    const name = camelCase(message.id.slice((namespace || '').length))
    if (message.placeholders.length) {
        return (
            `\
${genDocstring({ message, ...p })}
export function ${name}(args: {${message.placeholders.map(genArgType).join(', ')}}): {'data-l10n-id': string, 'data-l10n-args': string} {
    return {
        "data-l10n-id": ${JSON.stringify(message.id)},
        "data-l10n-args": JSON.stringify({${message.placeholders.map(genArgEncoder).map(arg => `\n            ${arg},`).join('')}
        })
    }
}
`
        )
    }
    else {
        return (`\
${genDocstring({ message, ...p })}
export const ${name}: {'data-l10n-id': string} =
    {"data-l10n-id": ${JSON.stringify(message.id)}}
`
        )
    }
}

function genDocstring(p: { message: Message, shortPath: string }) {
    const { message, shortPath } = p
    return (`\
/** Fluent message id \`${message.id}\`, in file \`${shortPath}\`

\`\`\`
${message.raw.replace('*/', '*\/').replace('\`', '\\\`')}
\`\`\`

*/
`)
}

function genArgType(v: Var) {
    switch (v.type) {
        case VarType.STRING: return `${v.name}: string`
        case VarType.NUMBER: return `${v.name}: number`
        case VarType.DATETIME: return `${v.name}: Date`
    }
}

function genArgEncoder(v: Var) {
    switch (v.type) {
        case VarType.STRING: return `${JSON.stringify(v.name)}: args.${v.name}`
        case VarType.NUMBER: return `${JSON.stringify(v.name)}: args.${v.name}`
        case VarType.DATETIME: return `${JSON.stringify(v.name)}: Math.floor(args.${v.name}.getTime()/1000)`
    }
}

export default main

