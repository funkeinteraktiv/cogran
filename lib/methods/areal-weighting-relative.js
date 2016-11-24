'use strict';

const Turf = require('turf');
const Logger = require('../logger');
const isUndefined = require('lodash/isUndefined');

function arealWeightingRelative(source, target, options, progress) {
  target.features.forEach((feature, i) => {
    Logger.info(`[arealWeightingRelative][${options.attr}][${i}/${target.features.length}]`);
	  feature.properties[options.attr] = calculateAttributeValue(feature, source, options, options.attr);
  });

  return target;
}

function calculateAttributeValue(feature, source, options, attributeName) {
  let result = 0;
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];

  intersects.forEach((d,i) => {

    const Ps = parseFloat(sourceFeatures[i].properties[attributeName]);
    const sb = Turf.extent(sourceFeatures[i]);
    let isInside = false;

    try {
      if(Turf.inside(Turf.point([sb[0], sb[1]]), d) && Turf.inside(Turf.point([sb[2], sb[3]]), d)) {
        isInside = true;
      }
    } catch(e) {};

    if(isInside) {
      result += Ps;
      return;
    }

    const As = Turf.area(feature);
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
