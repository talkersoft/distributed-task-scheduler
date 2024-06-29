#!/bin/bash
gitroot=$(git rev-parse --show-toplevel)
mkdir -p ~/.docker/data/task-scheduler

docker-compose down
pushd $gitroot
  docker-compose build
popd

docker-compose up