const errors = require('../../server/errors');
const reader = require('../datasources/reader');

const nomisIdPattern = new RegExp(
  require('../swagger/docs')
    .paths['/viper/{nomsId}']
    .parameters[0].pattern
);

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
