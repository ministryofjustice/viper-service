const NOT_AVAILABLE = 'Not Available';

const getBuildDate = (config) => {
  var d = new Date(config.env.BUILD_DATE);

  return (!isNaN(d.getTime())) ? d.toString() : NOT_AVAILABLE;
};

module.exports = (server) =>
  server.get(
    {
      url: '/ping',

      swagger: {
        summary: 'Check server is there',
        docpath: 'ping',
      },
    },
    (req, res, next) => {
      res.send({
        'version_number': server.config.env.VERSION_NUMBER || NOT_AVAILABLE,
        'build_date': getBuildDate(server.config),
        'commit_id': server.config.env.COMMIT_ID || NOT_AVAILABLE,
        'build_tag': server.config.env.BUILD_TAG || NOT_AVAILABLE,
      });

      return next();
    });
