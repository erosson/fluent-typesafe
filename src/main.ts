#!/usr/bin/env ts-node-script
import * as Parser from './parser'
import Path from 'path'
import Elm from './codegen/elm'
import { startCase } from 'lodash'

async function main() {
    // const paths = ['ftl/localization/en-US/main.ftl']
    const paths = [process.argv[2]]
    const resources: Parser.Resource[] = await Promise.all(paths.map(Parser.parseResource))
    // console.log(resources)
    resources.flat().map(r => {
        // r.messages.map(m => console.log(m))
        console.log(Elm(r.messages))
    })
}
main()