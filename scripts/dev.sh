#!/usr/bin/env bash

docker pull gomoto/node-docker-compose

# Port 35729 is for LiveReload.
# Pass all environment variables, except TMPDIR.
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):$(pwd) \
  --workdir=$(pwd) \
  --interactive \
  --tty \
  --rm \
  --expose 35729 \
  -p 35729:35729 \
  $(printenv | grep -v ^TMPDIR | sed 's/^/-e /') \
  gomoto/node-docker-compose \
  /bin/bash -c 'ln -s /Users /users; node scripts/dev'
