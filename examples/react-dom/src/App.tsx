import React from 'react'
import './App.css'
import '@fluent/web'
import * as L from './gen/localization'

function App() {
  return (
    <div className="App">
      <h1 {...L.helloWorld({ title: "THE TITLE" })}>
        {/* eslint-disable-next-line */}
        <a data-l10n-name="link" href="?a=1" />
      </h1>
      <a href="?a=2">test</a>
      {/* eslint-disable-next-line */}
      <h1 {...L.subTitle} />
      <p {...L.lights({ count: 4 })} />
      <p {...L.sharedPhotos({ userName: "REACT-DOM_USER", photoCount: 69, userGender: "other" })} />
    </div>
  );
}

export default App;
