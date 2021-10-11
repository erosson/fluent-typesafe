import Minimist from 'minimist'
import { promises as fs } from 'fs'
import _glob from 'glob'
import { promisify } from 'util'
import Path from 'path'
import Chokidar from 'chokidar'

import debounce from 'lodash/debounce'
import * as Parser from './parser'
import ElmFormat from './codegen/elm'
import ReactFormat from './codegen/react'
import ReactDomFormat from './codegen/react-dom'

const glob: (pattern: string, opts: object) => Promise<string[]> = promisify(_glob)
const usage = `usage: \`fluent-typesafe --format=[elm|react|react-dom] [--dry-run] [--watch] --out=OUTPUT_DIRECTORY FTL_DIRECTORY\``

type Args = { inputDir: string, outputDir: string, format: Format, dryRun: boolean, watch: boolean }
type Format = 'elm' | 'react' | 'react-dom'
type Runner = (resources: Array<[string, Promise<Parser.Resource>]>, write: ((path: string, data: string) => Promise<void>)) => Promise<void>

function parse(args: Minimist.ParsedArgs): Args {
    const inputDir: string | null = args._[0]
    const outputDir: string | null = args['out']
    const dryRun: boolean | null = args['dry-run']
    const watch: boolean | null = args['watch']
    if (!inputDir || !outputDir) {
        throw new Error(usage)
    }
    return { format: parseFormat(args), inputDir, outputDir, dryRun, watch }
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
    const pattern = '**/*.ftl'

    const runner: Runner = debounce(runnerFormat(args.format), 800)
    const writer = write(args)
    async function run() {
        const inputs: string[] = await glob(pattern, { cwd: args.inputDir })
        if (args.dryRun) {
            console.log(args, inputs)
        }
        const resources: Array<[string, Promise<Parser.Resource>]> =
            inputs.map(p => [p, Parser.parseResource(Path.join(args.inputDir, p))])
        return runner(resources, writer)
    }
    if (args.watch) {
        return Chokidar.watch(pattern, { persistent: true, awaitWriteFinish: true })
            .on('add', run)
            .on('change', run)
            .on('unlink', run)
    }
    else {
        return await run()
    }
}

main().catch(e => {
    console.error(e)
    process.exit(1)
})