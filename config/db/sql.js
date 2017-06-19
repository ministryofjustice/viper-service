const tedious = require('tedious');

function Connection (connection) {
  return {

    exec (sql, done) {
      var rows = [];

      var request = new tedious.Request(sql, function(err) {
        if (err) {
          console.error(err);
          return;
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

module.exports = {
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

      done(null, new Connection(connector));
    });
  },
};
