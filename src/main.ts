import * as Parser from './parser'
import ElmFormat from './codegen/elm'
import ReactFormat from './codegen/react'
import ReactDomFormat from './codegen/react-dom'
import Minimist from 'minimist'

const usage = `usage: \`fluent-typesafe --format=[elm|react|react-dom] FTL_PATH\``
type Format = 'elm' | 'react' | 'react-dom'
async function run(format: Format, r: Parser.Resource): Promise<string> {
    switch (format) {
        case 'elm': return ElmFormat(r.messages)
        case 'react': return ReactFormat(r.messages)
        case 'react-dom': return ReactDomFormat(r.messages)
    }
}
function parseFormat(args: Minimist.ParsedArgs) {
    switch (args.format) {
        case 'elm': return 'elm'
        case 'react': return 'react'
        case 'react-dom': return 'react-dom'
        default: throw new Error(usage)
    }
}
async function main() {
    const args = Minimist(process.argv.slice(2), { string: ['format'] })
    const paths: string[] = [args._[0]]
    const format: Format = parseFormat(args)
    // console.error(args, paths, format)
    const resources: Parser.Resource[] = await Promise.all(paths.map(Parser.parseResource))
    // console.error(resources)
    resources.flat().map(async r => {
        // r.messages.map(m => console.log(m))
        const out: string = await run(format, r)
        // console.log(out)
        process.stdout.write(out)
    })
}
main().catch(e => {
    console.error(e)
    process.exit(1)
})