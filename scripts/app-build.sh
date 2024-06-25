#!/bin/bash
gitroot=$(git rev-parse --show-toplevel)
$gitroot/scripts/re-yarn.sh
mkdir -p ~/.docker/data/task-scheduler

pushd $gitroot
  docker-compose up --build
popd