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

env var                        | default | required | description
------------------------------ | ------- | -------- | -----------------------------------
ADMIN_GROUP                    |         |          | Admin group name
API_GROUPS                     |         |          | Comma-separated list of group names
COOKIE_SECRET                  |         |          | String for signing cookies
IP                             | 0.0.0.0 |          | Server ip address
PORT                           | 9000    |          | Server port
STORMPATH_APPLICATION_HREF     |         | ✓        | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_ID     |         | ✓        | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_SECRET |         | ✓        | Required by express-stormpath



## Develop

`npm run dev`

Build and run application each time a file changes.

Use environment variables to parameterize the development experience.

env var  | default     | description
-------- | ----------- | ----------------------------------------
DEV_HOST | local       | Development host (local &#124; external)
DEV_PORT | 7000        | Development port



## Environment variables

Environment variables can be specified at the command line or in a file called
.env at the root of the project. Command line variables take precedence.



## Project structure

```
├── app/
│   ├── client/
│   ├── server/
│
├── client/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── favicon.ico
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
