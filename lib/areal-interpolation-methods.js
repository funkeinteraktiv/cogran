'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');

function arealWeighting(feature, source, options) {
  let result = 0; //initialize with zero by default
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];

  intersects.forEach((d,i) => {
    const Ps = d.properties[options.attr];
    const As = Turf.area(sourceFeatures[i]);
    const Ast = Turf.area(d);
    result += (Ast * Ps) / As;
  });

  return result;
}

function populationWeighting(feature, source, options) {
  let result = 0;
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];

  intersects.forEach((d,i) => {
    const As = d.properties[options.weight];
    const Ast = As * (Turf.area(d) / Turf.area(feature));
    const Ps = d.properties[options.attr];
    result += (Ast * Ps) / As;
  });

  return result;
}

function binaryDasymetricWeighting(feature, source, options) {
  return arealWeighting(feature, source, options);
}

function nClassDasymetricWeighting(feature, source, options) {
  return -1;
}

function getIntersectingFeatures(sourceFeatures, targetFeature) {
  let intersects = [];
  let featureSimpl = targetFeature;

  const sourceList = sourceFeatures.filter(f => {
    let intersection = Turf.intersect(featureSimpl, f);

    if(!isUndefined(intersection)) {
      intersection.properties = f.properties;

      if(f.properties.binary !== 0) {
        intersects.push(intersection);
      }
    }

    return !isUndefined(intersection) && f.properties.binary !== 0;
  });

  return [sourceList, intersects];
}

module.exports = {
  arealWeighting,
  populationWeighting,
  binaryDasymetricWeighting,
  nClassDasymetricWeighting
};