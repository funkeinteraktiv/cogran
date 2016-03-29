'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');

function arealWeighting(feature, source, propertyName) {
  let result = 0; //initialize with zero by default
  let intersects = [];

  const featureSimpl = feature;

  //first check which features are intersecting with the target feature
  const sourceFeatures = source.features.filter(f => {
    let intersection = Turf.intersect(featureSimpl, f);
    
    if(!isUndefined(intersection)) {
      intersection.properties = f.properties;
      intersects.push(intersection);
    }

    return !isUndefined(intersection);
  });

  //now we are doing the calculation based on the intersection
  intersects.forEach((d,i) => {
    const Ps = d.properties[propertyName];
    const As = Turf.area(sourceFeatures[i]);
    const Ast = Turf.area(d);
    result += (Ast * Ps) / As;
  });

  return result;
}

module.exports = {
  arealWeighting
};