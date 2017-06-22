const tedious = require('tedious');

function Connection (connection) {
  return {

    exec (sql, done) {
      var rows = [];

      var request = new tedious.Request(sql, function(err) {
        if (err) {
          return done(err);
        }

        done(null, rows);
      });

      request.on('row', (columns) => {
        var row = {};

        for (var column in columns) {
          row[column] = columns[column].value || 'NULL';
        }

        rows.push(row);
      });

      connection.execSql(request);
    },

    close () {
      connection.close();
    }

  };
}

const dbClient = {
  connect (config, done) {
    var connector = new tedious.Connection({
      userName: config.username,
      password: config.password,
      server: config.server,
      options: {
        encrypt: true,
        database: config.database,
        useColumnNames: true,
        rowCollectionOnRequestCompletion: true,
        port: config.port
      }
    });

    connector.on('connect', (err) => {
      if (err) {
        return done(err);
      }

      return done(null, new Connection(connector));
    });
  },
};

module.exports = (dbConfig, callback) => {
  if (!dbConfig) {
    return callback(null, { exec: function (sql, cb) {
 cb(null, [{SCORE:0.56}]);
}});
  }

  dbClient.connect(dbConfig, (err, db) => {
    if (err) {
      return callback(err);
    }

    return callback(null, db);
  });
};
