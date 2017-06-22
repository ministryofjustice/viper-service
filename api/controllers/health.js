const healthcheck = require('../health/healthcheck');

module.exports.health = (req, res, next) => {
  healthcheck(req.db).then( (result) => {
    res.send(result);
  });
};
