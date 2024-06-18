#!/bin/bash

SEARCH_STRING="task"

cd "$(git rev-parse --show-toplevel)"

rm -rf ./node_modules
yarn install
pushd ./task-scheduler-entities
    yarn install
popd

find . -type d -name "*$SEARCH_STRING*" -exec bash -c 'cd "$0" && rm -rf ./node_modules' {} \;
find . -type d -name "*$SEARCH_STRING*" -exec bash -c 'cd "$0" && yarn install' {} \;
find . -type d -name "*$SEARCH_STRING*" -exec bash -c 'cd "$0" && yarn build' {} \;
