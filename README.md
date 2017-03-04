# fullstack



## Install

`npm i`



## Build

`npm run build`

Build application.

Use environment variables to parameterize the build.

env var  | default     | description
-------- | ----------- | ----------------
NODE_ENV | development | Node environment



## Run

`node app/server/app.js`

Run application after it is built.

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
PORT                           | 9000      |          | Server port
STORMPATH_APPLICATION_HREF     |           | ✓        | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_ID     |           | ✓        | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_SECRET |           | ✓        | Required by express-stormpath



## Develop

`npm run dev`

Build and run application each time a file changes.

Use environment variables to parameterize the development experience.

env var           | default | description
----------------- | ------- | -----------------------------------------
DEV_HOST          | local   | Development host (local &#124; external)
DEV_PORT          | 7000    | Development port
DEV_USER_GROUPS   |         | Development user's groups
DEV_USER_USERNAME | test    | Development user's username



## Environment variables

Environment variables can be specified at the command line or in a file called
.env at the root of the project. Command line variables take precedence.



## Project structure

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
│
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
│   ├── tsconfig.json
│   ├── vendors.json
│
├── resources/
│   ├── images/
│   │   ├── favicon.ico
│
├── server/
│   ├── src/
│   │   ├── api/
│   │   ├── config/
│   │   ├── app.ts
│   │   ├── routes.ts
│   ├── tsconfig.json
│
├── .env
├── gulpfile.js
├── package.json
├── README.md

```
