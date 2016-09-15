'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');

function populationWeightingRelative(source, target, options, progress) {

  target.features.forEach(feature => {
    onEachFeature(feature, source, target, options);
  });

  target.features.forEach(feature => {
    onEachFeatureInga(feature, source, target, options);
  });

  return target;
}

function onEachFeatureInga(feature, source, target, options) {
  // hier werden die konkreten Attributwerte für die targets berechnet
  //console.log("-----------------------------------");
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];

  let result = 0;

  intersects.forEach((d,i) => {
    //const As = Turf.area(sourceFeatures[i]);
	const At = Turf.area(feature);
    const Ast = Turf.area(d);
    const Qt = feature.properties['population'];
    const Qst = (Ast / At) * Qt;
	const Relative = feature.properties['Relative'];
	const Gg = sourceFeatures[i].properties['Aggr'];
	const Ps = Gg * ((sourceFeatures[i].properties['Relative']) / 100);
	    
    result += (Qst / sourceFeatures[i].properties["Qs"]) * Ps;
	//console.log(JSON.stringify("result: " + result));
 	
  });
  
  feature.properties[options.attr] = result;
  console.log("result: " + JSON.stringify(result));
	
}

function onEachFeature(feature, source, target, options) {
  // hier berechnen wir erstmal nur die Werte für Qs und summieren sie pro betreffenden sourcefeature auf
  //console.log("-----------------------------------");
  const intersectData = getIntersectingFeatures(source.features, feature);
  const sourceFeatures = intersectData[0];
  const intersects = intersectData[1];

  
  intersects.forEach((d,i) => {
	const At = Turf.area(feature);
    const Ast = Turf.area(d);
    const Qt = feature.properties['population'];
    const Qst = (Ast / At) * Qt;
	const Relative = feature.properties['Relative'];
	
	const Gg = sourceFeatures[i].properties['Aggr'];
	const Ps = Gg * ((sourceFeatures[i].properties['Relative']) / 100);

	//console.log(JSON.stringify("Gg: " + Gg));
	//console.log(JSON.stringify("Ps: " + Ps));
	//console.log(JSON.stringify("Qst: " + Qst));
	//console.log(JSON.stringify(sourceFeatures[i].properties[options.attr]));

	if (!("Qs" in sourceFeatures[i].properties)) {
		sourceFeatures[i].properties["Qs"] = Qst; // noch kein Wert drin, mit jetzigem anfangen
	} else {
		sourceFeatures[i].properties["Qs"] += Qst; // sonst einfach immer aufaddieren
	}
	//console.log("Qs: " + JSON.stringify(sourceFeatures[i].properties["Qs"]));

	
  });
  
  
}
 //console.log(JSON.stringify(result));


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

module.exports = populationWeightingRelative;