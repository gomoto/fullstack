# fullstack



## Installation

`npm i`



## Environment variables

Environment variables can be specified in a single .env file at the root of the project.

variable                       | default    | description
------------------------------ | ---------- | -----------------------
ADMIN_GROUP                    | ''         | Admin group name
IP                             | '0.0.0.0'  | Server ip address
NODE_ENV                       | ''         | Node environment
PORT                           | '9000'     | Server port
SERVER_LOG                     | ''         | Path to server log
STORMPATH_APPLICATION_HREF     | ''         | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_ID     | ''         | Required by express-stormpath
STORMPATH_CLIENT_APIKEY_SECRET | ''         | Required by express-stormpath
STORMPATH_GROUPS               | ''         | Comma-separated list of group names



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
│   │   ├── config/
│   │   ├── modules/
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
│   │   ├── components/
│   │   ├── config/
│   │   ├── stormpath/
│   │   ├── views/
│   │   ├── app.ts
│   │   ├── routes.ts
│   ├── tsconfig.json
│
├── .env
├── gulpfile.js
├── package.json
├── README.md

```
