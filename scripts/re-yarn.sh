#!/bin/bash
gitroot=$(git rev-parse --show-toplevel)


function clean_node_modules_and_yarn_lock() {
    find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
    find . -name "yarn.lock" -type f -exec rm -f '{}' +
    echo "Deleted all node_modules directories and yarn.lock files."
}


pushd "$gitroot/backend"
  if [ "$NUKE" = true ]; then
    echo "Removing node_modules and yarn.lock in web-app"
    clean_node_modules_and_yarn_lock

  fi

  yarn install
  yarn workspace task-entities run build
  yarn workspace task-distributor run build
  yarn workspace task-processor run build
  yarn workspace task-scheduler run build
  yarn workspace task-scheduler-api run build
popd

pushd "$gitroot/web-app"
  if [ "$NUKE" = true ]; then
    clean_node_modules_and_yarn_lock
  fi

  yarn install
  yarn workspace storybook run build
  yarn workspace task-scheduler-web run build
popd
