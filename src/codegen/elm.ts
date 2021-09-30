import Path from 'path'
import { lowerFirst, upperFirst, camelCase } from 'lodash'
import * as childProcess from 'child_process'

import * as Tree from '../tree'
import { Resource, Message, Var, VarType } from '../parser'

type ModuleOutput = { name: string, messages: string[] }
async function main(resources: Array<[string, Promise<Resource>]>, write: (path: string, data: string) => Promise<void>): Promise<void> {
    const modules: ModuleOutput[] = await Promise.all(resources.map(async ([shortPath, pending]) => {
        const resource = await pending

        const parsed = Path.parse(shortPath)
        const segments = parsed.dir.split('/').filter(i => !!i)
        segments.push(parsed.name)

        const moduleName = `Localization.${segments.map(s => upperFirst(camelCase(s))).join('.')}`
        const outputPath = `${moduleName.replace('.', '/')}.elm`
        // console.log({ segments, moduleName, outputPath })
        const output = await elmFormat(genResource(resource.messages, moduleName))
        await write(outputPath, output)
        return { name: moduleName, messages: resource.messages.map(message => message.id) }
    }))
    // console.log(genIndex(modules))
    await write('Localization.elm', await elmFormat(genIndex(modules)))
}

function genIndex(modules: ModuleOutput[]): string {
    const root = Tree.build(modules.map(module => {
        const prefix = module.name.split('.').filter(i => i)
        return module.messages.map(msg => prefix.concat([camelCase(msg)]))
    }).flat())
    const tree = root.nodes.Localization
    return (`\
module Localization exposing (${[...tree.leaves, ...Object.keys(tree.nodes)].map(lowerFirst).join(', ')})

${genHeader}

${modules.map(m => `import ${m.name}`).join("\n")}

${genModuleTree(tree)}
`)
}
function genModuleTree(tree: Tree.Node): string {
    const leaves: Array<[string, string]> = tree.leaves.map(l => [l, tree.path.concat([l]).join('.')])
    const nodes: Array<[string, string]> = Object.entries(tree.nodes).map(([name, n]) => [name, `\n    { ${genModuleTree(n)}\n    }`])
    return [...leaves, ...nodes].map(([lval, rval]) => `${lowerFirst(lval)} = ${rval}`).join(`\n${Array((tree.path.length - 1) * 4).fill(' ').join('')}, `)
}

async function elmFormat(input: string): Promise<string> {
    // run the generated file through elm-format
    return new Promise((resolve, reject) => {
        const proc = childProcess.exec("elm-format --stdin", {}, (error, stdout, stderr) => {
            if (error) {
                // console.error(stderr)
                return reject(error)
            }
            return resolve(stdout)
        })
        if (!proc?.stdin) {
            return reject('failed to spawn elm-format')
        }
        // console.error(input)
        const stdin = proc.stdin // make typescript happy
        stdin.write(input, () => {
            stdin.end()
        })
    })
}
const genHeader = '{-| File auto-generated by `@erosson/fluent-typesafe`. Do not edit! -}'
function genResource(messages: Message[], moduleName: string) {
    const needsEncode = Math.max(...messages.map(m => m.placeholders.length)) > 0
    const needsPosix = messages.map(m => m.placeholders).flat().filter(v => v.type === VarType.DATETIME).length > 0
    return (`\
module ${moduleName} exposing(${messages.map(m => camelCase(m.id)).join(', ')})

${genHeader}

import Html as H
import Html.Attributes as A
${needsEncode ? 'import Json.Encode as E' : ''}
${needsPosix ? 'import Time exposing (Posix)' : ''}


${messages.map(genMessage).join("\n\n")}
`
    )
}
function genMessage(message: Message) {
    if (message.placeholders.length) {
        return (
            `\
${camelCase(message.id)}: { ${message.placeholders.map(genArgType).join(', ')} } -> List (H.Attribute msg)
${camelCase(message.id)} ${message.placeholders.length ? 'args ' : ''}=
    [ A.attribute "data-l10n-id" ${JSON.stringify(message.id)}
    , A.attribute "data-l10n-args" <| E.encode 0 <| E.object
        [ ${message.placeholders.map(genArgEncoder).join("\n        , ")}
        ]
    ]
`
        )
    }
    else {
        return (`\
${camelCase(message.id)}: H.Attribute msg
${camelCase(message.id)} =
    A.attribute "data-l10n-id" ${JSON.stringify(message.id)}
`
        )
    }
}

function genArgType(v: Var) {
    switch (v.type) {
        case VarType.STRING: return `${v.name} : String`
        case VarType.NUMBER: return `${v.name} : Float`
        case VarType.DATETIME: return `${v.name} : Posix`
    }
}

function genArgEncoder(v: Var) {
    switch (v.type) {
        case VarType.STRING: return `(${JSON.stringify(v.name)}, E.string args.${v.name})`
        case VarType.NUMBER: return `(${JSON.stringify(v.name)}, E.float args.${v.name})`
        case VarType.DATETIME: return `(${JSON.stringify(v.name)}, E.integer <| Time.posixToMillis args.${v.name})`
    }
}

export default main