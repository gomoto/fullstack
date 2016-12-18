# fullstack



## Install

`npm i`



## Develop

`npm run dev`

`NODE_ENV=production npm run dev`



## Environment variables

Environment variables can be specified in a single .env file at the root of the project.

variable                       | default | required | description
------------------------------ | ------- | -------- | -------------------------------------
ADMIN_GROUP                    |         |          | Admin group name
COOKIE_SECRET                  |         |          | String for signing cookies
DEV_HOST                       | local   |          | Development host (local &#124; external)
DEV_PORT                       | 7000    |          | Development port
IP                             | 0.0.0.0 |          | Server ip address
PORT                           | 9000    |          | Server port
STORMPATH_APPLICATION_HREF     |         | ✓        | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_ID     |         | ✓        | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_SECRET |         | ✓        | Required by express-stormpath
STORMPATH_GROUPS               |         |          | Comma-separated list of group names



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
│   │   ├── middleware/
│   │   ├── app.ts
│   │   ├── routes.ts
│   ├── tsconfig.json
│
├── .env
├── gulpfile.js
├── package.json
├── README.md

```
