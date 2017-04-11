const cache = {};

const retrieveViperRating = (nomsId) =>
  ({
    nomsId: nomsId,
    viperRating: cache[nomsId] = cache[nomsId] || Math.random().toFixed(2),
  });

const config = {
  url: '/offender/:nomsId/viper',

  swagger: {
    nickname: 'retrieveViperRating',
    summary: 'Retrieve VIPER Rating',
    docpath: 'offender',

    schemes: [ 'https' ],

    responseClass: 'Result',

    responseMessages: [
      {
        code: 200,
        message: 'OK',
        responseModel: 'Result',
      },
      {
        code: 401,
        message: 'Unauthorized; User or application must authenticate'
      },
      {
        code: 403,
        message: 'Forbidden; User not authorized to take this action'
      },
      {
        code: 404,
        message: 'Not Found; No rating for the given `id`'
      },
      {
        code: 409,
        message: 'Invalid Argument',
      },
      {
        code: 500,
        message: 'Internal Server Error',
      },
    ],
  },

  validation: {
    resources: {
      nomsId: { isRequired: true, regex: /[A-Z]\d{4}[A-Z]{2}/i },
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
    res.send(retrieveViperRating(req.params.nomsId));
    next();
  });
