'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');

let Qs = 0;

function populationWeighting(source, target, options, progress) {

  Qs = 0;

  target.features.forEach(feature => {
    onEachFeature(feature, source, target, options, Qs);
  });

  target.features.forEach(feature => {
    onEachFeature(feature, source, target, options);
    progress.tick(1);
  });

  return target;
}

function onEachFeature(feature, source, target, options, qs) {
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];

  let result = 0;

  intersects.forEach((d,i) => {
    const As = Turf.area(sourceFeatures[i]);
    const Ast = Turf.area(d);
    const Qt = feature.properties['population'];
    const Qst = (Ast / As) * Qt;

    if(!isUndefined(qs)) {
      Qs += Qst;
      return;
    }

    result += (Qst / Qs) * sourceFeatures[i].properties[options.attr];
  });

  feature.properties[options.attr] = result;
}

function getIntersectingFeatures(sourceFeatures, targetFeature) {
  let intersects = [];

  const sourceList = sourceFeatures.filter(f => {
    let intersection = Turf.intersect(targetFeature, f);

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

module.exports = populationWeighting;