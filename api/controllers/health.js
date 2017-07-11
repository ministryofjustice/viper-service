const healthcheck = require('../health/healthcheck');

module.exports.health = (req, res, next) => {
  healthcheck(req.db)
    .then((result) => {
      if (!result.healthy) {
        res.status(500);
      }
      res.send(result);
      return next();
    })
    .catch(next);
};
