#!/usr/bin/env bash
set -euo pipefail

rm -rf pages
mkdir -p pages

(cd examples/elm2 && yarn && yarn build)
cp -rp examples/elm2/build pages/elm

(cd examples/react && yarn && yarn build)
cp -rp examples/react/build pages/react

(cd examples/react-dom && yarn && yarn build)
cp -rp examples/react-dom/build pages/react-dom