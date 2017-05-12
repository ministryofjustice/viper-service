const sqlserver = require('../config/db/sql');

var config = {
  secure: true,
};

process.argv.forEach((val, index) => {
  if (index >= 2) {
    val = val.split('=');
    config[val[0]] = val[1];
  }
});

sqlserver.connect(config, (err, conn) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('>> INSERT');
  conn.exec("INSERT INTO aap_test (noms_id, viper_score) VALUES ('A1234BC', 0.6)", (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('>> SELECT');
    conn.exec("SELECT noms_id, viper_score FROM aap_test", (err, result) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(result);

      conn.close();
    });
  });
});

/*
// refresh db schema
use app-dev;
GO

if exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'viper_score_staging' AND TABLE_SCHEMA = 'dbo')
    drop table dbo.viper_score_staging;

CREATE TABLE viper_score_staging (
    nomsId varchar(7) NOT NULL,
    viperScore DECIMAL(3,2) NOT NULL,
    added DATETIME NOT NULL,
    CONSTRAINT PK_NomsId_Added PRIMARY KEY (nomsId, added)
);

if exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'viper_score' AND TABLE_SCHEMA = 'dbo')
    drop table dbo.viper_score;

CREATE TABLE viper_score (
    nomsId varchar(7) NOT NULL,
    viperScore DECIMAL(3,2) NOT NULL,
    CONSTRAINT PK_NomsId PRIMARY KEY (nomsId)
);
GO

// insert entries

INSERT INTO viper_score_staging (nomsId, viperScore, added) VALUES ('A1234BC', 0.6, '2017-01-01 00:00:00.000');
INSERT INTO viper_score (nomsId, viperScore) VALUES ('A1234BC', 0.6);

// merge from staging

USE app-dev;
GO
BEGIN TRAN;
MERGE viper_score AS T
USING viper_score_staging AS S
ON (T.noms_id = S.noms_id)
WHEN NOT MATCHED BY viper_score
    THEN INSERT(nomsId, viperScore) VALUES(S.nomsId, S.viperScore)
WHEN MATCHED
    THEN UPDATE SET T.viperScore = S.viperScore
# WHEN NOT MATCHED BY viper_score_staging
#    THEN DELETE
OUTPUT $action, Inserted.*, Deleted.*;
ROLLBACK TRAN;
GO
*/
