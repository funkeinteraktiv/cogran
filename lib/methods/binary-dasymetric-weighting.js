'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');
const objectAssign = require('object-assign');
const Logger = require('../logger');

function binaryDasymetricWeighting(source, target, options, progress) {

  const binaryMask = objectAssign({}, options.binary);

  const Asp = intersect(source, binaryMask);
  const Atsp = intersect(Asp, target);

  target.features.forEach(d => {
    let result = 0;
    const intersectData = getIntersectingFeatures(Atsp.features, d);
    const sourceFeatures = intersectData[0];
    const intersects = intersectData[1];

    intersects.forEach((d,i) => {
      const Atsp2 = Turf.area(d);
      const Ps = d.properties[options.attr];
      const Asp2 = d.properties.parentArea;

      result += (Atsp2 * Ps) / Asp2;
    });


    d.properties[options.attr] = result;
  });

  return target;
}

function getIntersectingFeatures(sourceFeatures, targetFeature) {
  let intersects = [];
  let featureSimpl = targetFeature;

  const sourceList = sourceFeatures.filter(f => {
    let intersection = undefined;
    try {
      Turf.intersect(featureSimpl, f);
    } catch(e) {}

    if(!isUndefined(intersection)) {
      intersection.properties = f.properties;
      intersects.push(intersection);
    }

    return !isUndefined(intersection)
  });

  return [sourceList, intersects];
}

function intersect(a, b) {

  let resultFeatures = [];

  a.features.forEach((d, i) => {
	Logger.info(`[binaryDasymetricWeighting][intersect][${i}/${a.features.length}]`);

	b.features.forEach(e => {
      let isIntersect = Turf.intersect(d, e);

      if(isIntersect) {
        isIntersect.properties = d.properties;
        isIntersect.properties.parentArea = Turf.area(d);
        resultFeatures.push(isIntersect);
      }
    });
  });

  return Turf.featurecollection(resultFeatures);
}

module.exports = binaryDasymetricWeighting;
