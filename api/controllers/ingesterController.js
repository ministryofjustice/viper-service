const ingester = require('../datasources/ingester');
const log = require('../../server/log');

module.exports.doIngest = (req, res, next) => {
  res.send(202);
  next();

  // Continue to run in the "background"
  ingester.ingest(req.db)
    .then((success) => {
      log.info(success);
    },
    (fail) => {
      log.error(fail);
    }
  );
};
