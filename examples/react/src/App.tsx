import React from 'react'
import './App.css'
import '@fluent/react'
import * as L from './gen/localization'
import initL10n from './initLocalization'
import { LocalizationProvider, ReactLocalization } from '@fluent/react'

function App() {
  const [l10n, setL10n] = React.useState<ReactLocalization | null>(null)
  React.useEffect(() => {
    (async () => {
      setL10n(await initL10n())
    })()
  }, [])
  if (!l10n) {
    return <div>Loading...</div>
  }
  return (
    <LocalizationProvider l10n={l10n}>
      <div className="App">
        <h1>
          {/* eslint-disable-next-line */}
          <L.HelloWorld vars={{ title: "THE TITLE" }} elems={{ a: <a href="?a=1" /> }}><span /></L.HelloWorld>
          {/* <Localized id="hello-world" vars={{ title: "THE TITLE" }} elems={{ a: <a href="?a=1" /> }}><span /></Localized> */}
        </h1>
        <a href="?a=2">test</a>
        <h1><L.SubTitle /></h1>
        <p><L.Lights vars={{ count: 4 }} /></p>
        <p><L.SharedPhotos vars={{ userName: "REACT_USER", photoCount: 420, userGender: "other" }} /></p>
      </div >
    </LocalizationProvider>
  );
}

export default App;
