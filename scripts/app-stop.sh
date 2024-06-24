#!/bin/bash
pushd "$(git rev-parse --show-toplevel)"
    docker-compose down
popd
