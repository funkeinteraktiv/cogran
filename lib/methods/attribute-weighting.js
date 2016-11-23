'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');
const Logger = require('../logger');

function attributeWeighting(source, target, options, progress) {

  target.features.forEach((feature,i) => {
    Logger.info(`[attributeWeighting][${options.attr}][${i}/${target.features.length * 2}]`);
    calculateQs(feature, source, target, options);
  });

  target.features.forEach((feature,i) => {
    Logger.info(`[attributeWeighting][${options.attr}][${i + target.features.length}/${target.features.length * 2}]`);
    calculateAttributeValue(feature, source, target, options);
  });

  return target;
}

function calculateAttributeValue(feature, source, target, options) {
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];

  let result = 0;

  intersects.forEach((d,i) => {
    const At = Turf.area(feature);
    const Ast = Turf.area(d);
    const Qt = feature.properties[options.weight];
    const Qst = (Ast / At) * Qt;
    const attributeValue = parseFloat(sourceFeatures[i].properties[options.attr]);

    if(!isNaN(attributeValue)) {
      result += (Qst / sourceFeatures[i].properties["Qs"]) * attributeValue;
    }
  });

  console.log(result);
  feature.properties[options.attr] = result;
}

function calculateQs(feature, source, target, options) {
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];


  intersects.forEach((d,i) => {
    const At = Turf.area(feature);
    const Ast = Turf.area(d);
    const Qt = feature.properties[options.weight];
    const Qst = (Ast / At) * Qt;

    if (!("Qs" in sourceFeatures[i].properties)) {
    	sourceFeatures[i].properties["Qs"] = Qst;
    } else {
    	sourceFeatures[i].properties["Qs"] += Qst;
    }
  });
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

module.exports = attributeWeighting;
