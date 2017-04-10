module.exports = (server) =>
  server.get(
    {
      url: '/ping',

      swagger: {
        summary: 'Check server is there',
        docpath: 'ping',
      },
    },
    (req, res, next) =>
      res.send({
        'version_number': server.config.env.VERSION_NUMBER || server.config.pkg.version,
        'build_date': new Date(server.config.env.BUILD_DATE || server.config.repoInfo.committerDate),
        'commit_id': server.config.env.COMMIT_ID || server.config.repoInfo.abbreviatedSha,
        'build_tag': server.config.env.BUILD_TAG || server.config.repoInfo.tag || server.config.repoInfo.branch,
      }) && next()
  );
