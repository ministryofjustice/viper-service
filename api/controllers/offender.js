const restify = require('restify')
const reader = require('../datasources/reader')
const cache = {}

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

  reader.read(nomsId, req.config.db).then(

    (viperRating) => {

      if (viperRating) {
        res.send(successfulViperRating(nomsId, viperRating));
      } else {
        next(new restify.ResourceNotFoundError(`/offender/${nomsId}/viper does not exist`));
      }
    },

    (err) => next(err))
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
