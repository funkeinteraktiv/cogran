'use strict'
/*
* cogran-aggregate.js
* A function that aggregates data from an input shapefile.
*/
let shapefile = require('shapefile');
let async = require('async');
let turf = require('turf');
let logger = require('./logger');

let aggregate = (args, cb) => {

  //read input and target shapefile
  async.map([args.input, args.target], shapefile.read, (err, res) => {
    if(err) {
      throw err;
    }

    let source = res[0];
    let target = res[1];
    let points = [];

    logger.log(`source file: ${source.features.length} features`);
    logger.log(`target file: ${target.features.length} features`);

    //transform input polygons to points
    [].forEach.call(source.features, (feature) => {
      let point = turf.center(feature);
      let srcAttr = feature.properties[args.attr];

      if(typeof srcAttr != 'number') {
        srcAttr = parseInt(srcAttr);
      }

      point.properties[args.attr] = srcAttr;
      points.push(point);
    });

    points = turf.featurecollection(points);

    //create featurecollection with new field from input data
    let result = turf.aggregate(target, points, [{ aggregation: args.mode, inField: args.attr, outField: args.attr }]);

    return cb(result);
  });

}

module.exports = aggregate;