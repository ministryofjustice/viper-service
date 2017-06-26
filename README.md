# VIPER Rating Service
A Restful service to provide access to the VIPER Rating for a known ID

## Swagger documentation
The details of the API  can found in [the online documentation](https://noms-digital-studio.github.io/viper-service/).

The swagger specification can be found on the path ```/api-docs```.

## Running with NodeJS
Start by ensuring you have the most recent version of NodeJS and NPM installed.

### Pre-requisites
To find the current version of NodeJS installed on your system, run the following command in your preferred shell;

```bash
$ node -v
```

If you have the latest versions installed you need to get the dependencies loaded, run the following command in your preferred shell;

```bash
$ npm install
```

### Running the tests
If you have all the Pre-requisites then you are ready to run the tests. Call the following from your shell;

```bash
$ npm test
```

### Running the server
If you have all the Pre-requisites then you are ready to run the service. Call the following from your shell;

```bash
$ npm start
```

### Running the server with raw logs
If you wish to have the output in raw JSON, then you can run the server without piping it through bunyan's formatter. Call the following from your shell;

```bash
$ node server.js
```

### Database connections

This can be left out in dev mode, and any API routes which use the database will fail.

In production the DB connection config is required. The variable should be set like this:

DB_URI=mssql://username:password@server-host:1433/database-name?encrypt=true

#### Migrations

Migrations are managed using [knex](http://knexjs.org/#Migrations-CLI).

You can execute them with
```
npm run migrate
```

Other knex commands can be run via
```
npm run knex -- <other args>
```

#### Seed data

To reset the database back into a known-data state, you can use the seed scripts

```
npm run seed
```

#### Local database setup

To run the database locally, use the [docker image](https://hub.docker.com/r/microsoft/mssql-server-linux/).
```
docker pull microsoft/mssql-server-linux
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=<password>' -p 1433:1433 -d microsoft/mssql-server-linux
```

After you have a database, you'll need to create the database and application user. On real environments this is handled by the terraform code.
```
npm install -g sql-cli
mssql -s localhost -u sa -p <password>
USE master;
EXEC sp_configure 'contained database authentication', 1;
RECONFIGURE WITH OVERRIDE;
CREATE DATABASE aap CONTAINMENT = PARTIAL COLLATE SQL_Latin1_General_CP1_CI_AS;
USE aap;
CREATE USER <database-user> WITH PASSWORD = '<database-user-password>';
.quit
```

And then run the migrations as with any other environment.
```
npm run knex -- migrate:currentVersion
npm run migrate
```

#### Local database manual querying

The `sql-cli` package installed above gives you a commandline client called `mssql`.

```
mssql -s localhost -u <database-user> -p <password> -d aap
```
