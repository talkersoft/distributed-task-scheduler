#!/bin/bash
cd "$(git rev-parse --show-toplevel)"

SEARCH_STRING="task"

cd "$(git rev-parse --show-toplevel)"

yarn install

find . -maxdepth 2 -type d -name "*$SEARCH_STRING*" -print | while read -r dir; do
  folder_name=$(basename "$dir")
  echo "Building workspace $folder_name"
  yarn workspace "$folder_name" run build
done

mkdir -p ~/.docker/data/task-scheduler
docker-compose up --build
