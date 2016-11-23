'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');
const Logger = require('../logger');

function populationWeighting(source, target, options, progress) {
  target.features.forEach((feature,i) => {
    Logger.info(`[attributeWeightingAdvanced][${options.attr}][${i}/${target.features.length * 2}]`);
    onEachFeature(feature, source, target, options);
  });

  target.features.forEach((feature,i) => {
    Logger.info(`[attributeWeightingAdvanced][${options.attr}][${i + target.features.length}/${target.features.length * 2}]`);
    onEachFeatureHannes(feature, source, target, options);
  });

  return target;
}

function onEachFeatureHannes(feature, source, target, options) {
  // hier werden die konkreten Attributwerte für die targets berechnet
  //console.log("-----------------------------------");
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

    // wenn komplett im source feature,
    const sb = Turf.extent(sourceFeatures[i]);
    let isInside = true;

    if(!Turf.inside(Turf.point([sb[0], sb[1]]), d)) { isInside = false };
    if(!Turf.inside(Turf.point([sb[2], sb[3]]), d)) { isInside = false };

    if(isInside) {
      if(!isNaN(attributeValue)) {
        result += Ps;
      }
      return;
    }


    if(!isNaN(attributeValue)) {
      result += (Qst / sourceFeatures[i].properties["Qs"]) * attributeValue;
    }
  });

  feature.properties[options.attr] = result;
  //console.log("result: " + JSON.stringify(result));
}

function onEachFeature(feature, source, target, options) {
  // hier berechnen wir erstmal nur die Werte für Qs und summieren sie pro betreffenden sourcefeature auf
  //console.log("-----------------------------------");
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];


  intersects.forEach((d,i) => {
	//const As = Turf.area(sourceFeatures[i]);
    const At = Turf.area(feature);
    const Ast = Turf.area(d);
    const Qt = feature.properties[options.weight];
    const Qst = (Ast / At) * Qt;
	//console.log(d.properties);
	//console.log("As: " + JSON.stringify(As));
	//console.log("Ast: " + JSON.stringify(Ast));
	//console.log("At: " + JSON.stringify(At));
	//console.log("Qt: " + JSON.stringify(Qt));
	//console.log("Qst: " + JSON.stringify(Qst));

    if (!("Qs" in sourceFeatures[i].properties)) {
    	sourceFeatures[i].properties["Qs"] = Qst; // noch kein Wert drin, mit jetzigem anfangen
    } else {
    	sourceFeatures[i].properties["Qs"] += Qst; // sonst einfach immer aufaddieren
    }
	//console.log("Qs: " + JSON.stringify(sourceFeatures[i].properties["Qs"]));


  });


}
 // console.log(JSON.stringify(result));

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
