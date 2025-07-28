#!/bin/bash

npm install husky --save-dev
npm set-script prepare "husky install"
npm run prepare

mkdir -p .husky

echo '#!/bin/sh
npm run lint

npm run lint' > .husky/pre-commit
chmod +x .husky/pre-commit

echo '#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test' > .husky/pre-push
chmod +x .husky/pre-push
