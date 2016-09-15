'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');

function arealWeightingRelative(source, target, options) {

  target.features.forEach((d,i) => {
		Logger.info(`[arealWeightingRelative][${options.attr}][${i}/${target.features.length}]`);
    d.properties[options.attr] = arealWeighting(d, source, options);
  });

  return target;
}

function arealWeighting(feature, source, options) {
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

module.exports = arealWeightingRelative;
