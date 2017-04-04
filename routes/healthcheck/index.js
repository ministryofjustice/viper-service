module.exports = (server) =>
  server.get(
    {
      url: '/healthchecks',

      swagger: {
        summary: 'Perform service healthchecks',
        docpath: 'healthchecks',
      },
    },
    (req, res, next) => (res.send({ message: 'I feel good!' })) && next()
  );
