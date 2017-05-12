const restify = require('restify');

const cache = {};

const successfulViperRating = (nomsId, viperRating) =>
  ({
    nomsId: nomsId,
    viperRating: viperRating,
  });

const retrieveViperRating = (nomsId) => {
  switch (nomsId) {
    case 'A1234BC': return 0.56;
    case 'C4321BA': return;
    default:        return (cache[nomsId] = cache[nomsId] || Math.random().toFixed(2));
  }
};

const config = {
  url: '/offender/:nomsId/viper',

  swagger: {
    nickname: 'retrieveViperRating',
    summary: 'Retrieve VIPER Rating',
    docpath: 'retrieveViperRating',

    schemes: [ 'https' ],

    responseClass: 'Result',

    responseMessages: [
      {
        code: 200,
        responseModel: 'Result',
      },
      {
        code: 404,
        message: 'Not Found; No rating for the given `id`'
      },
      {
        code: 409,
        message: 'Invalid Argument',
      },
    ],
  },

  validation: {
    resources: {
      nomsId: { isRequired: true, regex: /[A-Z]\d{4}[A-Z]{2}/ },
    },
  },

  models: {
    Result: {
      id: 'Result',
      properties: {
          nomsId: { type: 'String' },
          ViperRating: { type: 'Number' }
      }
    },
  },
};

module.exports = (server) =>
  server.get(config, (req, res, next) => {
    var nomsId = req.params.nomsId;
    var viper = retrieveViperRating(nomsId);

    if (!viper) {
      next(new restify.ResourceNotFoundError(`/offender/${nomsId}/viper does not exist`));
    }

    res.send(successfulViperRating(nomsId, viper));
  });
