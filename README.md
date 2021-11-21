# Who-Sings
JavaScript Engineer Test 


1. create package.json
   `npm init`
2. install typescript and ts-node (Typescript node runner so we don't need to build the application everytime we do a change)
   `npm i -D typescript ts-node`
3. create tsconfig.json
   `npx typescript --init`
4. configure scripts in package.json (start, build, test)
5. install express
   `npm install express --save`
6. install types definitions for Express
   `npm i -D @types/express`
7. create src/app.ts (will contain basic express configuration)
8. create src/server.ts (where server will be setuped up)
9. install nodemon
   `npm i -D nodemon`
10. create and configure nodemon.json
11. install dotenv
    `npm install dotenv`
    `npm install --save-dev @types/dotenv`
12. create .env file
13. install and Configure ESLint (a linter for ECMAScript)
    `npx eslint --init`
    `npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard`
14. install and Configure Prettier (code Formatter)
    `npm i --save-dev --save-exact prettier`
15. create .prettierrc.json with prettier configuration
16. install Husky and pretty-quick (used to run Prettier before each commit)
17. add husky config into package.json

# Compile/Build and Run App

1. Build
   `npm run build`
2. Run
   `node build/index.js`

# Install Docker and Docker-compose

- create docker-compose.yml with declarations
- start container
  `docker-compose up`
- connect DB to API

# Setup Postgres into Docker

- install typeorm, reflect-metadata
  `npm install typeorm reflect-metadata --save`
- install Postgres
  `npm install pg --save`
- add postgres image configuration in docker-compose.yml
db:
    container_name: postgresDB
    image: postgres:latest
    restart: always
    ports:
      - '5433:5433'
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: password
      POSTGRES_DB: postgres_db
- create configuration file for connection
- import db configuration in app.ts

# Setup MongoDV into Docker

- TODO
