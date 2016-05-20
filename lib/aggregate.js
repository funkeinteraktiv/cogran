'use strict'
/*
* cogran-aggregate.js
* A function that aggregates data from an input shapefile.
*/
const Turf = require('turf');
const Path = require('path');
const Logger = require('./logger');
const Errors = require('./errors');
const FileLoader = require('./fileloader');

function aggregate(args, cb) {

  if(typeof args.input == 'undefined' || typeof args.target == 'undefined') {
    Logger.error(Errors.missingArgument);
    return Errors.missingArgument;
  }

  args.mode = args.mode || 'sum';

  if(Path.extname(args.input) == '.shp' && Path.extname(args.target) == '.shp') {
    FileLoader.readShapefiles([args.input, args.target], getAggregationFunction(args, cb));
  }
  else {
    FileLoader.readGeoJson([args.input, args.target], getAggregationFunction(args, cb));
  }

}

function getAggregationFunction(args, cb) {
  return (err, res) => {
    if(err) {
      return Logger.error(err);
    }

    const source = res[0];
    const target = res[1];
    let points = [];

    Logger.info(`source file: ${source.features.length} features`);
    Logger.info(`target file: ${target.features.length} features`);

    //transform input polygons to points
    [].forEach.call(source.features, feature => {
      let point = Turf.center(feature);
      let srcAttr = feature.properties[args.attr];

      if(typeof srcAttr != 'number') {
        srcAttr = parseInt(srcAttr);
      }

      point.properties[args.attr] = srcAttr;
      points.push(point);
    });

    points = Turf.featurecollection(points);

    //create featurecollection with new field from input data
    const result = Turf.aggregate(target, points, [{ aggregation: args.mode, inField: args.attr, outField: args.attr }]);

    return cb(result); 
  }
}

module.exports = aggregate;