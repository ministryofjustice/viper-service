module.exports = function healthcheck (db) {
  const results = {
    healthy: true,
    checks: {
      db: 'ok'
    }
  };

  var checkDb = new Promise((resolve) => {
    db.exec('select 1', (err, rows) => {
      if (err) {
        results.healthy = false;
        results.checks.db = 'Not ok: ' + err;
      }
      resolve(results);
    });
  });

  return new Promise((resolve) => {

    checkDb.then(() => {

      results.uptime = process.uptime();

      try {
        results.build = require('../build-info.json');
      } catch (ex) {
        // no build info to show
      }

      try {
        results.version = require('../package.json').version;
      } catch (ex) {
        // no version info to show
      }

      resolve(results);
    });
  });
};
