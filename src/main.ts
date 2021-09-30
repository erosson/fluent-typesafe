import Minimist from 'minimist'
import { promises as fs } from 'fs'
import glob from 'glob'
import { promisify } from 'util'
import Path from 'path'

import * as Parser from './parser'
import ElmFormat from './codegen/elm'
import ReactFormat from './codegen/react'
import ReactDomFormat from './codegen/react-dom'

const usage = `usage: \`fluent-typesafe [--dry-run] --format=[elm|react|react-dom] --out=OUTPUT_DIRECTORY FTL_DIRECTORY\``

type Args = { inputDir: string, outputDir: string, format: Format, dryRun: boolean }
type Format = 'elm' | 'react' | 'react-dom'
type Runner = (resources: Array<[string, Promise<Parser.Resource>]>, write: ((path: string, data: string) => Promise<void>)) => Promise<void>

function parse(args: Minimist.ParsedArgs): Args {
    const inputDir: string | null = args._[0]
    const outputDir: string | null = args['out']
    const dryRun: boolean | null = args['dry-run']
    if (!inputDir || !outputDir) {
        throw new Error(usage)
    }
    return { format: parseFormat(args), inputDir, outputDir, dryRun }
}
function parseFormat(args: Minimist.ParsedArgs): Format {
    switch (args.format) {
        case 'elm': return 'elm'
        case 'react': return 'react'
        case 'react-dom': return 'react-dom'
        default: throw new Error(usage)
    }
}
function runnerFormat(format: Format): Runner {
    switch (format) {
        case 'elm': return ElmFormat
        case 'react': return ReactFormat
        case 'react-dom': return ReactDomFormat
    }
}
function write(args: Args) {
    return async (path: string, data: string) => {
        const fullpath = Path.resolve(Path.join(args.outputDir, path))
        if (args.dryRun) {
            console.log('(fake) write', fullpath, data.length)
        } else {
            console.log('write', fullpath, data.length)
            await fs.mkdir(Path.parse(fullpath).dir, { recursive: true })
            return fs.writeFile(fullpath, data)
        }
    }
}

async function main() {
    const args = parse(Minimist(process.argv.slice(2), { string: ['format', 'out'], boolean: ['dry-run'] }))
    const inputs: string[] = await promisify(glob)('**/*.ftl', { cwd: args.inputDir })
    if (args.dryRun) {
        console.log(args, inputs)
    }
    const resources: Array<[string, Promise<Parser.Resource>]> = inputs.map(p => [p, Parser.parseResource(Path.join(args.inputDir, p))])
    const runner: Runner = runnerFormat(args.format)
    return await runner(resources, write(args))
}

main().catch(e => {
    console.error(e)
    process.exit(1)
})