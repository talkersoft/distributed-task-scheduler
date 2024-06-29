#!/bin/bash
gitroot=$(git rev-parse --show-toplevel)
$gitroot/scripts/re-yarn.sh
mkdir -p ~/.docker/data/task-scheduler

docker-compose down
pushd $gitroot
  docker-compose build
popd