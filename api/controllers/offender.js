const restify = require('restify');

const cache = {};

const asJson = (res, obj) =>
  res.send(obj);

const withParam = (req, key) =>
  (req.swagger.params[key] && req.swagger.params[key].value);

const successfulViperRating = (nomsId, viperRating) =>
  ({
    nomsId: nomsId,
    viperRating: 1 * viperRating,
  });

const retrieveViperRating = (nomsId) => {
  switch (nomsId) {
    case 'A1234BC': return 0.56;
    case 'C4321BA': return;
    default:        return (cache[nomsId] = cache[nomsId] || Math.random().toFixed(2));
  }
};

module.exports.retrieveViperRating = (req, res, next) => {
  var nomsId = withParam(req, 'nomsId');
  var viperRating = retrieveViperRating(nomsId);

  if (!viperRating) {
    return next(new restify.ResourceNotFoundError(`/offender/${nomsId}/viper does not exist`));
  }

  asJson(res, successfulViperRating(nomsId, viperRating));

  next();
};

module.exports.recordViperRating = (req, res, next) => {
  var nomsId = withParam(req, 'nomsId');
  var viperRating = withParam(req, 'viperRating');

  if (!nomsId) {
    return next(new restify.InvalidArgumentError('nomsId is required'));
  }

  if (!viperRating) {
    return next(new restify.InvalidArgumentError('viperRating is required'));
  }

  cache[nomsId] = viperRating;

  asJson(res, successfulViperRating(nomsId, viperRating));

  next();
};
