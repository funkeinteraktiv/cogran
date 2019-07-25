'use strict';

const Turf = require('turf');
const Logger = require('../logger');
const isUndefined = require('lodash/isUndefined');
const rbush = require('rbush');

function main(source, target, options) {
  target.features.forEach((d, i) => {
    Logger.info(`[arealWeighting][${options.attr}][${i}/${target.features.length}]`);
    d.properties[options.attr] = arealWeighting(d, source, options, options.attr);
  });

  return target;
}

function arealWeighting(feature, source, options, attributeName) {
  let result = 0;
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];
  

  intersects.forEach((d,i) => {
    const Ps = parseFloat(sourceFeatures[i].properties[attributeName]);
    if(isNaN(Ps)) { return; }
    const As = Turf.area(sourceFeatures[i]);
    const Ast = Turf.area(d);
    result += (Ast * Ps) / As;
  });

  return result;
}

function getIntersectingFeatures(sourceFeatures, targetFeature) {
  let intersects = [];
  let sourceList = [];  // source features that got intersected?
  
  /* Create and fill the bushy tree */
  var tree = rbush();
  let items = [];
  
  for (var i=0; i<sourceFeatures.length; i++) {
    var bbox = Turf.extent(sourceFeatures[i]);
    var item = {
      minX: bbox[0],
      minY: bbox[1],
      maxX: bbox[2],
      maxY: bbox[3],
      index: i
    };
    items.push(item);
  }
  
  tree.load(items);

  /* Quickly get the likely candidates that might intersect */
  var bbox = Turf.extent(targetFeature);
  var candidates = tree.search({
    minX: bbox[0],
    minY: bbox[1],
    maxX: bbox[2],
    maxY: bbox[3]
  });
  
  /* Check the candidates for actual intersection and do the rest */
  for (var i=0; i<candidates.length; i++) {
    var index = candidates[i].index;
    var f = sourceFeatures[index];
    
    let intersection = Turf.intersect(targetFeature, f);

    if(!isUndefined(intersection)) {
      intersection.properties = f.properties;
      intersects.push(intersection);
      sourceList.push(f);
    }
  }

  return [sourceList, intersects];
}

module.exports = main;
