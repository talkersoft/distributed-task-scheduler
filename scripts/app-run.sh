#!/bin/bash
gitroot=$(git rev-parse --show-toplevel)
mkdir -p ~/.docker/data/task-scheduler

pushd $gitroot
  docker-compose build
popd

docker-compose up