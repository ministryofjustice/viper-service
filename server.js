// Do appinsights first as it does some magic instrumentation work
require('./server/azure-appinsights');

const http = require('http');

const config = require('./server/config');
const log = require('./server/log');

const makeDB = require('./server/db');
const makeApp = require('./server/app');

const db = makeDB();

makeApp(config, log, db, (err, app) => {
  if (err) throw err;

  const server = http.createServer(app);
  server.listen(config.port, () => {
    log.info({addr: server.address()}, 'Server listening');
  });
});
