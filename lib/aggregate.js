'use strict'
/*
* cogran-aggregate.js
* A function that aggregates data from an input shapefile.
*/
const Shapefile = require('shapefile');
const Async = require('async');
const Turf = require('turf');
const Logger = require('./logger');

function aggregate(args, cb) {

  //read input and target shapefile
  Async.map([args.input, args.target], Shapefile.read, (err, res) => {
    if(err) {
      throw err;
    }

    let source = res[0];
    let target = res[1];
    let points = [];

    Logger.info(`source file: ${source.features.length} features`);
    Logger.info(`target file: ${target.features.length} features`);

    //transform input polygons to points
    [].forEach.call(source.features, (feature) => {
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
    let result = Turf.aggregate(target, points, [{ aggregation: args.mode, inField: args.attr, outField: args.attr }]);

    return cb(result);
  });

}

module.exports = aggregate;