const restify = require('restify');

const config = require('./server/config');
const log = require('./server/log');

const makeDB = require('./server/db');
const makeApp = require('./server/app');

makeDB(config.dbConn, (err, db) => {
  if (err) throw err;
  makeApp(config, log, db, (err, server) => {
    if (err) throw err;

    server.on('listening', () => {
      log.info({addr: server.address()}, 'Server listening');
    });
    server.on('after', restify.auditLogger({log}));

    server.listen(config.port);
  });
});