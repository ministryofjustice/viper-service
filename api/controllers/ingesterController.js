const ingester = require('../datasources/ingester');
const log = require('../../server/log');

module.exports.doIngest = (req, res) => {
  res.status(202);
  res.json({result: 'accepted'});

  // Continue to run in the "background"
  ingester.ingest(req.db)
    .then(
      (success) => {
        log.info(success);
      },
      (err) => {
        log.error(err);
      }
    );
};
