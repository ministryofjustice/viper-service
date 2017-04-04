const send = (res, next) => (body) => res.send(body) && next();

const retrieveViperRating = (nomsId) =>
  new Promise((res) => res({
    nomsId: nomsId,
    viperRating: Math.random().toFixed(2),
  }));

module.exports = (server) =>
  server.get(
    {
      url: '/offender/:nomsId/viper',

      swagger: {
        summary: 'Retrieve VIPER Rating',
        docpath: 'offender',
      },
    },
    (req, res, next) => retrieveViperRating(req.params.nomsId).then(send(res, next))
  );
