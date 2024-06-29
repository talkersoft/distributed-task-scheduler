#!/bin/bash

echo "WARNING: This operation will nuke the database."
read -p "Are you sure you want to proceed? Type 'yes' to continue: " confirm

case "$confirm" in
    [yY][eE][sS] | [yY])
        echo "Proceeding with the operation..."
        ;;
    *)
        echo "Operation aborted."
        exit 1
        ;;
esac

pushd "$(git rev-parse --show-toplevel)"
    docker-compose down
popd

rm -rf ~/.docker/data/task-scheduler
