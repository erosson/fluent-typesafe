module Main exposing (..)

import Browser
import Html as H exposing (Html)
import Html.Attributes as A
import Localization as L



---- MODEL ----


type alias Model =
    {}


init : ( Model, Cmd Msg )
init =
    ( {}, Cmd.none )



---- UPDATE ----


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )



---- VIEW ----


view : Model -> Html Msg
view model =
    H.div []
        [ H.h1 (L.helloWorld { title = "THE TITLE" } ++ [])
            -- TODO make this typesafe too! @fluent/syntax doesn't parse these, @fluent/dom/src/dom-overlay.ts does - but in a difficult format.
            -- `H.h1 (L.helloWorld {title="THE TITLE"} {link=[A.href "https://google.com"] []})`
            --
            -- second parameter is {<data-l10n-name-key>: (List (Attribute msg), List (Html msg)}
            -- tag name is implied!
            -- [ H.a [ A.attribute "data-l10n-name" "link", A.href "https://google.com" ] []
            [ H.a [ A.attribute "data-l10n-name" "link", A.href "?a=1" ] []
            ]
        , H.a [ A.href "?a=2" ] [ H.text "test" ]
        , H.h2 [ L.subTitle ] []
        , H.p (L.lights { count = 4 } ++ []) []
        , H.p (L.sharedPhotos { userName = "USERUSER", photoCount = 13, userGender = "other" } ++ []) []
        ]



---- PROGRAM ----


main : Program () Model Msg
main =
    Browser.element
        { view = view
        , init = \_ -> init
        , update = update
        , subscriptions = always Sub.none
        }
