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

  var nomsId = withParam(req, 'nomsId')

  reader.read(nomsId, req.db).then(

    (viperRating) => {

      if (viperRating) {
        res.send(successfulViperRating(nomsId, viperRating));
      } else {
        next(new restify.ResourceNotFoundError(`/offender/${nomsId}/viper does not exist`));
      }
    },

    (err) => next(err))
}
