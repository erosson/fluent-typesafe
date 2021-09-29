{-| an unused Elm file, for syntax highlighting while editing the `elm.ts` template.
-}


module Localization exposing (hello, withArgs)

import Html as H
import Html.Attributes as A
import Json.Encode as E


message_ : String -> H.Attribute msg
message_ =
    A.attribute "data-l10n-id"


args_ : E.Value -> H.Attribute msg
args_ =
    E.encode 0 >> A.attribute "data-l10n-args"


hello : H.Attribute msg
hello =
    message_ "hello"


withArgs : { x : string } -> List (H.Attribute msg)
withArgs args =
    [ message_ "with-args"
    , args_ <|
        E.object
            [ ( "x", E.string args.x )
            ]
    ]
