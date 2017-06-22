module.exports = function healthcheck (db) {
  const results = {
    healthy: true,
    checks: {
      db: 'ok'
    }
  };

  return db.select(db.raw('1'))
    .catch((err) => {
      results.healthy = false;
      results.checks.db = 'Not ok: ' + err;
    })
    .then(() => {
      results.uptime = process.uptime();
      results.build = safely(() => require('../build-info.json'));
      results.version = safely(() => require('../package.json').version);

      return results;
    });
};

function safely(fn) {
  try {
    return fn();
  } catch (ex) {
    // ignore failures
  }
}
