import 'regenerator-runtime' // required for @fluent/web
import '@fluent/web'

import './main.css'
import { Elm } from './Main.elm'

Elm.Main.init({
  node: document.getElementById('root')
});