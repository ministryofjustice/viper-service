const pkg = require('../../package.json');
const getRepoInfo = require('git-repo-info');

const repoInfo = getRepoInfo();

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
      build_date: new Date(repoInfo.committerDate),
      commit_id: repoInfo.abbreviatedSha,
      build_tag: repoInfo.tag || repoInfo.branch,
    })) && next()
  );
