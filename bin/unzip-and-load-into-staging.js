#!/usr/bin/env node

const yauzl = require('yauzl');
const csv = require('csv-stream');

const options = {
  columns : ['offender_id_display', 'viper'], // by default read the first line and use values found as columns
};

var csvStream = csv.createStream(options);

yauzl.open('vipers.zip', {lazyEntries: true}, function (err, zipfile) {
  if (err) throw err;
  zipfile.readEntry();
  zipfile.on('entry', function (entry) {
      zipfile.openReadStream(entry, function (err, readStream) {
        if (err) {
          throw err;
        }
        readStream.on('end', function () {
          zipfile.readEntry();
        });
        readStream.pipe(csvStream, 'utf-8')
          .on('error',function(err){
            console.error(err);
          })
          .on('data',function(data){
            // outputs an object containing a set of key/value pair representing a line found in the csv file.
            console.log(data);
          });
          // .on('column',function(key,value){
          //   // outputs the column name associated with the value found
          //   console.log('#' + key ' = ' + value);
          // })
      });
    }
  );
});
