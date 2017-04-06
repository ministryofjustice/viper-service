const pkg = require('../../package.json');

module.exports = (server) =>
  server.get(
    {
      url: '/ping',

      swagger: {
        summary: 'Check server is there',
        docpath: 'ping',
      },
    },
    (req, res, next) => (res.send({
      version_number: pkg.version,
      build_date: '20150721',
      commit_id: process.env.npm_package_gitHead,
      build_tag: 'test',
      env: process.env,
    })) && next()
  );
