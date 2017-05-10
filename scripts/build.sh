#!/usr/bin/env bash

docker pull gomoto/node-docker-compose

docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):$(pwd) \
  --workdir=$(pwd) \
  --interactive \
  --tty \
  --rm \
  gomoto/node-docker-compose \
  /bin/bash -c 'ln -s /Users /users; node scripts/build'
