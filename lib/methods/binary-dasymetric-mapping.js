'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');
const objectAssign = require('object-assign');

function binaryDasymetricMapping(source, target, options, progress) {
  
  const binaryMask = objectAssign({}, options.binary);
  
  binaryMask.features = binaryMask.features.filter(d => {
    return d.properties.binary == 1;
  });

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

      //const Asp2 = Turf.area(Asp.features[i]);


      // const Ps = sourceFeatures[i].properties[options.attr];
      // const As = Turf.area(sourceFeatures[i]);
      
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

function intersect(a, b) {

  let resultFeatures = [];

  a.features.forEach(d => {
    b.features.forEach(e => {
      const isIntersect = Turf.intersect(d, e);

      if(isIntersect) {
        isIntersect.properties = d.properties;
        isIntersect.properties.parentArea = Turf.area(d);
        resultFeatures.push(isIntersect);
      }
    });
  });

  return Turf.featurecollection(resultFeatures);
}

module.exports = binaryDasymetricMapping;