import { Message, Var, VarType } from '../parser'
import { camelCase } from 'lodash'

function gen(messages: Message[]) {
    return (
        `\
{-- File auto-generated by \`@erosson/fluent-typesafe\`. Do not edit! --}
module Localization exposing (${messages.map(m => camelCase(m.id)).join(', ')})

import Html as H
import Html.Attributes as A
import Json.Encode as E
import Time exposing (Posix) 


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
        return (
            `\
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

export default gen