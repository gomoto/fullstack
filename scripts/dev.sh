#!/usr/bin/env bash

docker pull gomoto/node-docker-compose

# Port 35729 is for LiveReload

docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):$(pwd) \
  --workdir=$(pwd) \
  --interactive \
  --tty \
  --rm \
  --expose 35729 \
  -p 35729:35729 \
  -e AUTH0_DOMAIN=$AUTH0_DOMAIN \
  -e AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID \
  -e OFFLINE_USER=$OFFLINE_USER \
  -e AUTH0_CALLBACK_PATH=$AUTH0_CALLBACK_PATH \
  -e AUTH0_SILENT_CALLBACK_PATH=$AUTH0_SILENT_CALLBACK_PATH \
  -e IP=$IP \
  -e MONGO_DB=$MONGO_DB \
  -e MONGO_HOST=$MONGO_HOST \
  -e MONGO_PORT=$MONGO_PORT \
  -e NODE_ENV=$NODE_ENV \
  -e OFFLINE_USER=$OFFLINE_USER \
  -e OFFLINE_USER_EMAIL=$OFFLINE_USER_EMAIL \
  -e OFFLINE_USER_FIRST_NAME=$OFFLINE_USER_FIRST_NAME \
  -e OFFLINE_USER_LAST_NAME=$OFFLINE_USER_LAST_NAME \
  -e OFFLINE_USER_GROUPS=$OFFLINE_USER_GROUPS \
  -e OFFLINE_USER_ROLES=$OFFLINE_USER_ROLES \
  -e OFFLINE_USER_PERMISSIONS=$OFFLINE_USER_PERMISSIONS \
  -e PORT=$PORT \
  gomoto/node-docker-compose \
  /bin/bash -c 'ln -s /Users /users; node scripts/dev'
