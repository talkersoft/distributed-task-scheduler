#!/bin/bash
pushd "$(git rev-parse --show-toplevel)"

  WORKSPACE_SEARCH_STRINGS=("task")
  PACKAGE_DEPENDENCY_DIRS=("init-db")
  NUKE=false

  # Check for the --nuke argument
  for arg in "$@"; do
    if [ "$arg" == "--nuke" ]; then
      NUKE=true
    fi
  done

  cd "$(git rev-parse --show-toplevel)"

  if [ "$NUKE" = true ]; then
    echo "Removing root node_modules and yarn.lock"
    rm -rf ./node_modules
    rm -f ./yarn.lock

    for SEARCH_STRING in "${WORKSPACE_SEARCH_STRINGS[@]}"; do
      echo "Removing node_modules and yarn.lock in subdirectories matching $SEARCH_STRING"
      find . -maxdepth 2 -type d -name "*$SEARCH_STRING*" -exec bash -c 'cd "$0" && echo "Removing node_modules in $0" && rm -rf ./node_modules && rm -f ./yarn.lock' {} \;
    done

    for DIR in "${PACKAGE_DEPENDENCY_DIRS[@]}"; do
      echo "Removing node_modules and yarn.lock in $DIR"
      rm -rf ./$DIR/node_modules
      rm -f ./$DIR/yarn.lock
    done
  fi

  for DIR in "${PACKAGE_DEPENDENCY_DIRS[@]}"; do
    echo "Installing dependencies in $DIR"
    pushd ./$DIR
    yarn install
    popd
  done

  echo "Running yarn install at root"
  yarn install

  echo "Building workspaces"
  for SEARCH_STRING in "${WORKSPACE_SEARCH_STRINGS[@]}"; do
    find . -maxdepth 2 -type d -name "*$SEARCH_STRING*" -print0 | while IFS= read -r -d '' dir; do
      folder_name=$(basename "$dir")
      echo "Building workspace $folder_name"
      yarn workspace "$folder_name" run build
    done
  done

popd