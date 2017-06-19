const restify = require('restify');
const reader = require('../datasources/reader');
const cache = {};

const asJson = (res, obj) =>
  res.send(obj);

const withParam = (req, key) =>
  (req.swagger.params[key] && req.swagger.params[key].value);

const withBody = (req, key) =>
  (req.swagger.params.body && req.swagger.params.body.value && req.swagger.params.body.value[key]);

const successfulViperRating = (nomsId, viperRating) =>
  ({
    nomsId: nomsId,
    viperRating: 1 * viperRating,
  });

const retrieveViperRating = (nomsId, db, cb) => {
  reader.read(nomsId, db, cb);
  // switch (nomsId) {
  //   case 'A1234BC': cb(0.56);
  //   case 'C4321BA': cb();
  //   case 'A3163JU': reader.read(nomsId, db, cb); break
  //   default:        cb (cache[nomsId] = cache[nomsId] || Math.random().toFixed(2));
  // }
};

module.exports.retrieveViperRating = (req, res, next) => {
  console.log(req);

  function cb(viperRating) {
    if (!viperRating) {
      return next(new restify.ResourceNotFoundError(`/offender/${nomsId}/viper does not exist`));
    }
    asJson(res, successfulViperRating(nomsId, viperRating));
    next();
  }

  var nomsId = withParam(req, 'nomsId');
  retrieveViperRating(nomsId, req.config.db, cb);

};

module.exports.recordViperRating = (req, res, next) => {
  var nomsId = withParam(req, 'nomsId');
  var viperRating = withBody(req, 'viperRating');

  if (!nomsId) {
    return next(new restify.InvalidArgumentError('nomsId is required'));
  }

  if (!viperRating) {
    return next(new restify.InvalidArgumentError('viperRating is required'));
  }

  cache[nomsId] = viperRating;

  res.send(201);

  next();
};
