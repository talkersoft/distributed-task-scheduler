#!/bin/bash
cd "$(git rev-parse --show-toplevel)"

docker-compose down

rm -rf ~/.docker/data/task-scheduler