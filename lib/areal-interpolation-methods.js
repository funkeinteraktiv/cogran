'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');

function arealWeighting(feature, source, options) {
  let result = 0; //initialize with zero by default
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];

  intersects.forEach((d,i) => {
    const Ps = sourceFeatures[i].properties[options.attr];
    const As = Turf.area(sourceFeatures[i]);
    const Ast = Turf.area(d);
    result += (Ast * Ps) / As;
  });

  return result;
}

function arealWeightingRelative(feature, source, options) {
  let result = 0; //initialize with zero by default
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];

  intersects.forEach((d,i) => {
    const Gg = sourceFeatures[i].properties['Aggr'];
	const Ps = Gg * ((sourceFeatures[i].properties['Relative']) / 100);
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
  
  let Qt = 0;

  sourceFeatures.forEach(d => {
    Qt += d.properties[options.weight];
  });

  intersects.forEach((d,i) => {
    const Ast = Turf.area(d);
    const As = Turf.area(sourceFeatures[i]);

    const Qs = sourceFeatures[i].properties[options.weight];


    
    const Qst = As * (Turf.area(d) / Turf.area(sourceFeatures[i]));
    const Ps = sourceFeatures[i].properties[options.attr];
    result += (Qst * Ps) / Qt;
  });

  return result;
}

function binaryDasymetricWeighting(feature, source, options) {
  const result = arealWeighting(feature, source, options);
  return result;
}

function binaryDasymetricWeightingRelative(feature, source, options) {
  const result = binaryDasymetricWeighting(feature, source, options);
  return result;
}

function nClassDasymetricWeighting(feature, source, options) {
  return -1;
}

//function nClassDasymetricWeightingRelative(feature, source, options) {
//  return -1;
//}

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