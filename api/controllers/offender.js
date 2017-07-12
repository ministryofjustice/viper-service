const errors = require('../../server/errors');
const reader = require('../datasources/reader');

const nomisIdPattern = /^[A-Z]\d{4}[A-Z]{2}$/;

module.exports.retrieveViperRating = (req, res, next) => {

  var nomsId = req.params.nomsId;

  if (!nomisIdPattern.test(nomsId)) {
    return errors.validation(res, 'invalid nomsId');
  };

  reader.read(nomsId, req.db).then(
    (viperRating) => {
      if (!viperRating) {
        return errors.notFound(res,
          `viper record for nomsId ${nomsId} does not exist`
        );
      }
      return res.json({
        nomsId: nomsId,
        viperRating: 1 * viperRating,
      });
    },
    (err) => next(err)
  );
};
