# fullstack



## Install

`docker-compose run --rm npm-client`

`docker-compose run --rm npm-server`

Default entrypoint is `npm` and default command is `install`,
but any valid npm command works:

`docker-compose run npm-client prune`



## Build

`docker-compose up builder`

Build application.

Use environment variables to parameterize the application.

env var                        | default     | required | description
------------------------------ | ----------- | -------- | -----------------------------------------
COOKIE_SECRET                  |             |          | String for signing cookies
IP                             | 0.0.0.0     |          | Server ip address
MONGO_DB                       | local       |          | MongoDB database name
MONGO_HOST                     | localhost   |          | MongoDB host
MONGO_PORT                     | 27017       |          | MongoDB port
NODE_ENV                       | development |          | Node environment
PORT                           | 9000        |          | Server port



## Develop

`docker-compose up watcher`

```
AUTH0_DOMAIN=xxx.auth0.com \
AUTH0_CLIENT_ID=xxx \
AUTH0_CLIENT_SECRET=xxx \
OFFLINE_USER=true \
OFFLINE_USER_ID=test \
OFFLINE_USER_NAME=Test \
OFFLINE_USER_PERMISSIONS=read:thing,create:thing \
docker-compose -f docker-compose.fullstack.yml up --build watcher
```

Build and run application.
Each time a client file changes, browser reloads.
Each time a server file changes, app container restarts.

Use environment variables to parameterize the development experience.

environment variable       | default          | description
-------------------------- | ---------------- | ------------------------------------------------------
AUTH0_CALLBACK_PATH        | /callback        | Path to Auth0 callback.
AUTH0_SILENT_CALLBACK_PATH | /silent-callback | Path to Auth0 silent-callback.
OFFLINE_USER               |                  | Offline user? Set to 'true' to enable offline user.
OFFLINE_USER_ID            | test             | Offline user's id.
OFFLINE_USER_NAME          | Test             | Offline user's name.
OFFLINE_USER_PERMISSIONS   |                  | Offline user's permissions, as a comma-separated list.



## Project structure

```
├── client/
│   ├── src/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── config/
│   │   ├── errors/
│   │   ├── styles/
│   │   ├── index.html
│   │   ├── index.scss
│   │   ├── index.ts
│   ├── package.json
│   ├── tsconfig.json
│
├── resources/
│   ├── fonts/
│   │   ├── font.otf
│   │   ├── font.ttf
│   │   ├── font.woff
│   ├── images/
│   │   ├── favicon.ico
│   │   ├── image.png
│
├── server/
│   ├── src/
│   │   ├── api/
│   │   ├── config/
│   │   ├── app.ts
│   │   ├── routes.ts
│   ├── package.json
│   ├── tsconfig.json
│
├── README.md

```



## Project structure (built)

```
├── app/
│   ├── client/
│   │   ├── index.html
│   │   ├── static/
│   │   │   ├── index-#.css
│   │   │   ├── index-#.js
│   │   │   ├── vendor-#.js
│   ├── resources/
│   ├── server/
```



## AngularJS

AngularJS version must be 1.6+ to avoid Auth0 issue where hash symbol is
excluded from callback URL.
