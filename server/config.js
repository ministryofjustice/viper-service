const pkg = require('../package.json');
const env = process.env;

const dev = env.NODE_ENV !== 'production';

function optionalInDev(name, convert = (x) => x) {
  if (name in env) {
    return convert(env[name]);
  }
  if (dev) {
    return null;
  }
  throw new Error(`Missing ${name} environment variable`);
}

module.exports = {
  name: pkg.name,
  version: pkg.version,
  dev: dev,
  dbConn: optionalInDev('DB_CONN', JSON.parse),
  buildDate: env.BUILD_DATE,
  commitId: env.COMMIT_ID,
  buildTag: env.BUILD_TAG,
  port: env.PORT || '3000',
  auth: {
    user: env.BASIC_AUTH_USER,
    pass: env.BASIC_AUTH_PASS
  }
};

