'use strict'
/*
* filewriter.js
* Takes a geojson object and writes it as zipped-shapefile to an output path.
*/
const Fs = require('fs');
const Shp = require('shp-write');
const Logger = require('./logger');

let write = (data, path) => {
  Logger.info(`writing to output file: ${path}`);
  
  let zip = Shp.zip(data);

  Fs.open(path, 'w', (err,fd) => {
    if(err) { throw err };

    Fs.write(fd, zip, 0, zip.length, null, (err) => {
      if(err) { throw err };

      Fs.close(fd, () => {
        Logger.info(`shapefile generated in: ${path}`);
      });
    })

  });
}

module.exports = {
  write : write
}