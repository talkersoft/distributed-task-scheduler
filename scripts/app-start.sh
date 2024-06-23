#!/bin/bash
cd "$(git rev-parse --show-toplevel)"

mkdir -p ~/.docker/data/task-scheduler
docker-compose up -d
