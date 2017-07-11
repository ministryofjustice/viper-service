const restify = require('restify');
const reader = require('../datasources/reader');

const nomisIdPattern = /^[A-Z]\d{4}[A-Z]{2}$/;

const successfulViperRating = (nomsId, viperRating) =>
  ({
    nomsId: nomsId,
    viperRating: 1 * viperRating,
  });

module.exports.retrieveViperRating = (req, res, next) => {

  var nomsId = req.params.nomsId;

  if (!nomisIdPattern.test(nomsId)) {
    next(new restify.BadRequestError("Validation errors"));
    return;
  };

  reader.read(nomsId, req.db).then(

    (viperRating) => {

      if (viperRating) {
        res.send(successfulViperRating(nomsId, viperRating));
        next();
      } else {
        next(new restify.ResourceNotFoundError(`viper record for nomsId ${nomsId} does not exist`));
      }
    },

    (err) => next(err));
};
