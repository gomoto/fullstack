# fullstack



## Install

`docker-compose up install-client`

`docker-compose up install-server`



## Build

`docker-compose up builder`

Build application.

Use environment variables to parameterize the application.

env var                        | default   | required | description
------------------------------ | --------- | -------- | -----------------------------------------
ADMIN_GROUPS                   |           |          | Comma-separated list of admin group names
API_GROUPS                     |           |          | Comma-separated list of API group names
COOKIE_SECRET                  |           |          | String for signing cookies
IP                             | 0.0.0.0   |          | Server ip address
MONGO_DB                       | local     |          | MongoDB database name
MONGO_HOST                     | localhost |          | MongoDB host
MONGO_PORT                     | 27017     |          | MongoDB port
NODE_ENV                       |development|          | Node environment
PORT                           | 9000      |          | Server port
STORMPATH_APPLICATION_HREF     |           | ✓        | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_ID     |           | ✓        | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_SECRET |           | ✓        | Required by express-stormpath



## Develop

`docker-compose up watcher`

Build and run application.
Each time a client file changes, browser reloads.
Each time a server file changes, app container restarts.

Use environment variables to parameterize the development experience.

env var           | default | description
----------------- | ------- | -----------------------------------------
DEV_USER_GROUPS   |         | Development user's groups
DEV_USER_USERNAME | test    | Development user's username



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
│   ├── vendors.json
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
