#!/bin/bash
pushd "$(git rev-parse --show-toplevel)"
  ./scripts/re-yarn.sh
  mkdir -p ~/.docker/data/task-scheduler
  docker-compose up --build
popd