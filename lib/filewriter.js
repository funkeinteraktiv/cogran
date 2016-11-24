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

  Fs.writeFile(path, JSON.stringify(data, null, 4), function(err) {
      if(err) {
        Logger.error(err);
      } else {
        Logger.info(`JSON saved to: ${path}`);
      }
  }); 
}

module.exports = {
  write : write
}