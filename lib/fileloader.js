'use strict'

const Async = require('async');
const Shapefile = require('shapefile');
const Fs = require('fs');

function readShapefiles(fileNames, callback) {
  Async.map(fileNames, Shapefile.read, callback);
}

function readGeoJson(fileNames, callback) {
  let res;
  try {
    res = fileNames.map(parseGeoJson);
    callback(null, res);
  } catch(e) {
    callback(e, null);
  }
}

function parseGeoJson(fileName) {
  return JSON.parse(Fs.readFileSync(fileName).toString());
}

module.exports = {
  readShapefiles,
  readGeoJson
}