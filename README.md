# fullstack



## Install

`npm i`

Client and server directories each have their own node_modules, which
automatically get installed during `npm i`



## Build

`node scripts/build`



## Clean

`rm -rf build`



## Development

`node scripts/dev`

Builds code and runs application in a container.
Client file changes trigger livereloads.
Server file changes trigger app container restarts.

Note: Running this script inside npm scripts interferes with graceful removal of
app container.

Online

```
AUTH0_DOMAIN=xxx.auth0.com \
AUTH0_CLIENT_ID=xxx \
node scripts/dev
```

Offline

```
OFFLINE_USER=true \
OFFLINE_USER_PERMISSIONS=read:thing,create:thing \
node scripts/dev
```

Environment variables parameterize the application.

environment variable       | default          | description
-------------------------- | ---------------- | -------------------------------------------------------
AUTH0_DOMAIN               |                  | Auth0 tenant. Required when not using offline-user.
AUTH0_CLIENT_ID            |                  | Auth0 application id. Required when not using offline-user.
AUTH0_CALLBACK_PATH        | /callback        | Path to Auth0 callback.
AUTH0_SILENT_CALLBACK_PATH | /silent-callback | Path to Auth0 silent-callback.
IP                         | 0.0.0.0          | Server ip address
MONGO_DB                   | local            | MongoDB database name
MONGO_HOST                 | localhost        | MongoDB host
MONGO_PORT                 | 27017            | MongoDB port
NODE_ENV                   | development      | Node environment
OFFLINE_USER               |                  | Offline user? Set to 'true' to enable offline user.
OFFLINE_USER_EMAIL         | test@test.com    | Offline user's email.
OFFLINE_USER_FIRST_NAME    | First            | Offline user's first name.
OFFLINE_USER_LAST_NAME     | Last             | Offline user's last name.
OFFLINE_USER_GROUPS        |                  | Offline user's groups, as a comma-separated list.
OFFLINE_USER_ROLES         |                  | Offline user's roles, as a comma-separated list.
OFFLINE_USER_PERMISSIONS   |                  | Offline user's permissions, as a comma-separated list.
PORT                       | 9000             | Server port



## Project build

```
├── build/
│   ├── client/
│   │   ├── index.html
│   │   ├── static/
│   │   │   ├── index-#.css
│   │   │   ├── index-#.js
│   │   │   ├── vendor-#.js
│   ├── resources/
│   ├── server/
│   ├── git-sha.txt
```



## AngularJS

AngularJS version must be 1.6+ to avoid Auth0 issue where hash symbol is
excluded from callback URL.
