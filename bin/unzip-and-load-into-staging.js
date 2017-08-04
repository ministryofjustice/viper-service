#!/usr/bin/env node

const yauzl = require('yauzl');
const csv = require('csv');
const filename = process.argv[2];

const options = {
  columns : ['offender_id_display', 'viper'], // by default read the first line and use values found as columns
};

console.log("filename is " + filename);

yauzl.open(filename, {lazyEntries: true}, function (err, zipfile) {
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
        const parser = csv.parse(options);
        readStream.pipe(parser)
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
