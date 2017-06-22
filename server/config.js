const url = require('url');

const pkg = require('../package.json');
const env = process.env;

const dev = env.NODE_ENV !== 'production';

module.exports = {
  name: pkg.name,
  version: pkg.version,
  dev: dev,
  db: optionalInDev('DB_URI', parseDBUri),
  buildDate: env.BUILD_DATE,
  commitId: env.COMMIT_ID,
  buildTag: env.BUILD_TAG,
  port: env.PORT || '3000',
  auth: {
    user: env.BASIC_AUTH_USER,
    pass: env.BASIC_AUTH_PASS
  }
};

function optionalInDev(name, convert = (x) => x) {
  if (name in env) {
    return convert(env[name]);
  }
  if (dev) {
    return null;
  }
  throw new Error(`Missing ${name} environment variable`);
}

function parseDBUri(uri) {
  const parsed = url.parse(uri);
  const auth = parsed.auth.split(':');
  return {
    server: parsed.hostname,
    user: auth[0],
    password: auth[1],
    database: parsed.pathname.slice(1)
  };
}
