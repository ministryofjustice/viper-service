const restify = require('restify')
const reader = require('../datasources/reader')
const cache = {}

const asJson = (res, obj) =>
  res.send(obj)

const withParam = (req, key) =>
  (req.swagger.params[key] && req.swagger.params[key].value)

const withBody = (req, key) =>
  (req.swagger.params.body && req.swagger.params.body.value && req.swagger.params.body.value[key])

const successfulViperRating = (nomsId, viperRating) =>
  ({
    nomsId: nomsId,
    viperRating: 1 * viperRating,
  })

module.exports.retrieveViperRating = (req, res, next) => {
  console.log(req)

  var nomsId = withParam(req, 'nomsId')

  function handleResult(viperRating) {
    if (!viperRating) {
      next(new restify.ResourceNotFoundError(`/offender/${nomsId}/viper does not exist`))
    } else {
      asJson(res, successfulViperRating(nomsId, viperRating))
    }
  }

  reader.read(nomsId, req.config.db)
    .then(handleResult, (err) => {throw err})

  // function cb(viperRating) {
  //   if (!viperRating) {
  //     return next(new restify.ResourceNotFoundError(`/offender/${nomsId}/viper does not exist`));
  //   }
  //   asJson(res, successfulViperRating(nomsId, viperRating));
  //   next();
  // }

  // retrieveViperRating(nomsId, req.config.db, cb);

}

module.exports.recordViperRating = (req, res, next) => {
  var nomsId = withParam(req, 'nomsId')
  var viperRating = withBody(req, 'viperRating')

  if (!nomsId) {
    return next(new restify.InvalidArgumentError('nomsId is required'))
  }

  if (!viperRating) {
    return next(new restify.InvalidArgumentError('viperRating is required'))
  }

  cache[nomsId] = viperRating

  res.send(201)

  next()
}
