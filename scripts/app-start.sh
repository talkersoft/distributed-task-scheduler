#!/bin/bash
pushd "$(git rev-parse --show-toplevel)"
    docker-compose up -d
popd
