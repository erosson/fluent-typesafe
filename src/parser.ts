import * as Syntax from '@fluent/syntax'
import { promises as fs } from 'fs'
import { uniqBy } from 'lodash'

export type Resource = {
    path: string,
    raw: string,
    resource: Syntax.Resource,
    messages: Message[],
}
export type Message = {
    id: string,
    placeholders: Var[],
    attributes: Set<string>,
    raw: string,
}
export type Var = {
    name: string,
    type: VarType,
}
export enum VarType {
    STRING = 'string',
    NUMBER = 'number',
    DATETIME = 'datetime',
}
function parseInlineExpression(expr: Syntax.InlineExpression): Var | null {
    switch (expr.type) {
        case 'VariableReference':
            return { name: expr.id.name, type: VarType.STRING }
        case 'FunctionReference':
            const first = expr.arguments.positional[0]
            switch (first?.type) {
                case 'VariableReference':
                    const name = first.id.name
                    switch (expr.id.name) {
                        case 'NUMBER':
                            return { name, type: VarType.NUMBER }
                        case 'DATETIME':
                            return { name, type: VarType.DATETIME }
                        default: return null
                    }
                default: return null
            }
        default: return null
    }
}
function parseExpression(expr: Syntax.Expression): Var[] {
    switch (expr.type) {
        case 'SelectExpression':
            return [parseInlineExpression(expr.selector), ...expr.variants.map(variant => parsePattern(variant.value)).flat()].filter((v): v is Var => !!v)
        default: return [parseInlineExpression(expr)].filter((v): v is Var => !!v)
    }
}
function parsePattern(pattern: Syntax.Pattern): Var[] {
    const placeables = pattern.elements.filter((el): el is Syntax.Placeable => el.type === 'Placeable')
    return placeables.map(el => parseExpression(el.expression)).flat().filter((exp): exp is Var => !!exp)
}
function parseResource_(path: string, raw: string): Resource {
    const resource = Syntax.parse(raw, {})
    const msgs: Syntax.Message[] = resource.body.filter<Syntax.Message>((entry): entry is Syntax.Message => entry.type === 'Message')
    const messages: Message[] = msgs.map(message => {
        const id = message.id.name
        const attributes = new Set(message.attributes.map(attr => attr.id.name))
        const patterns: Syntax.Pattern[] = [message.value, ...message.attributes.map(a => a.value)].filter((p): p is Syntax.Pattern => !!p)
        // TODO prefer numbers and datetimes over strings
        const placeholders: Var[] = uniqBy(patterns.map(parsePattern).flat(), 'name')
        const rawMsg = raw.slice(message.span.start, message.span.end)
        return { id, placeholders, attributes, raw: rawMsg }
    })
    return { path, raw, resource, messages }
}
export async function parseResource(path: string): Promise<Resource> {
    const raw = await fs.readFile(path, 'utf8')
    return parseResource_(path, raw)
}
