const ingester = require('../datasources/ingester');

module.exports.doIngest = (req,res) => {
  res.send(202);
  ingester.ingest(req.db);
};
