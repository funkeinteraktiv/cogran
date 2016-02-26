'use strict'
/*
* filewriter.js
* Takes a geojson object and writes it as zipped-shapefile to an output path.
*/
let fs = require('fs');
let shp = require('shp-write');
let logger = require('./logger');

let write = (data, path) => {
  logger.log('writing to output file... ' + path);
  
  let zip = shp.zip(data);

  fs.open(path, 'w', (err,fd) => {
    if(err) { throw err };

    fs.write(fd, zip, 0, zip.length, null, (err) => {
      if(err) { throw err };

      fs.close(fd, () => {
        logger.log('shapefile generated in: ', path);
      });
    })

  });
}

module.exports = {
  write : write
}