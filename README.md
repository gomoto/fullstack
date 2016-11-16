# fullstack



## Installation

`npm i`



## typings

Typings for client and server are managed separately.

### client
```
npm run client:typings install <name> [options]
npm run client:typings uninstall <name> [options]
```

### server
```
npm run server:typings install <name> [options]
npm run server:typings uninstall <name> [options]
```



## Environment variables

variable          | default               | description
----------------- | --------------------- | -----------------------
ADMIN_GROUP       | ''                    | Admin group name
IP                | '0.0.0.0'             | Server ip address
NODE_ENV          | ''                    | Node environment
PORT              | '9000'                | Server port
SERVER_LOG        | ''                    | Path to server log
STORMPATH_GROUPS  | ''                    | Comma-separated list of group names
