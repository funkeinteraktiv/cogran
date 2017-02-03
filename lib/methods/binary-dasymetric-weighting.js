'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');
const objectAssign = require('object-assign');
const Logger = require('../logger');
var fs = require('fs');

function arealizeGeometryCollection(gc) {
	// takes a geometrycollection and removes all of its geometries that are not Polygonal (Polygon or MultiPolygon)
	// because Turf.intersect does not seem to like mixed dimensions for one of its parameters or something?
	
	// return a Polygon if only one polygon is in it
	// otherwise return a MultiPolygon
	
	// no gc was passed, so just return the original
	if (gc.geometry.type !== "GeometryCollection") {
		return gc;
	}
	
	// otherwise make a new gc and only add the polygonal geometries to it
	var arealFeature = JSON.parse(JSON.stringify(gc));
	arealFeature.geometry = null; // remove the geometry
	
	// collect the geometries we can handle
	var arealGeometries = [];
	var geometries = gc.geometry.geometries;
	for (var geometry of geometries) {
		//console.log(geometry.type);
		if (geometry.type === "Polygon") {
			arealGeometries.push(geometry);
			//console.log(geometry);
		} else if (geometry.type === "MultiPolygon") {
			console.log("ARGH! MultiPolygon.") // TODO
		} else {
			console.log("Dropping a "+geometry.type);
		}
	}
	
	// check if we got more than 1, if so, we need to create a multipolygon
	if (arealGeometries.length === 1) {
		arealFeature.geometry = arealGeometries[0];
	} else if (arealGeometries.length > 1) {
		// in arealGeometries stecken jetzt polygone
		// MP will nur liste der coordinate arrays davon
		// TODO what about holes in polygons?!
		var coordinates = [];
		for (var polygon of arealGeometries) {
			coordinates.push(polygon.coordinates);
		}
		arealFeature.geometry = {
			"type": "MultiPolygon",
			"coordinates": coordinates
			};
	} else {
		console.log("ARGH! No valid geometries, maybe return null?!") // TODO
		arealFeature.geometry = {
			"type": "Point",
			"coordinates": [-999999999999999,-99999999999999]
		}
		// ugh........ ugly workaround...
		// if we return a point somewhere in eternity it will be a valid geometry
		// but never lead to an intersection later on, just as we want
	}
	
	return arealFeature;
	
}

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
	  //debugger;
	  //console.log("f: " + Turf.area(f));
	  
	// There might be areas too tiny to be useful and they crash Turf.intersect(featureSimpl, f);
	if (Turf.area(f) < 180) {  // TODO: sinnvollen Wert (à la 1cm) für minimale Fläche finden. Mit 0.1e-10 scheint gut für wenige Testdaten Berlin
		console.log("Dropping Feature with tiny area");
		return;
	}
	
    let intersection = Turf.intersect(featureSimpl, f);  // This crashes if f is really really small or something. 23.1.2017

    if(!isUndefined(intersection)) {
	  intersection = arealizeGeometryCollection(intersection);
	  intersection.properties = f.properties;

      if(f.properties.binary !== 0) {
        intersects.push(intersection);
      }
    }

    return !isUndefined(intersection)
  });

  return [sourceList, intersects];
}

function intersect(a, b) {

  let resultFeatures = [];
 
  a.features.forEach((d, i) => {
	Logger.info(`[binaryDasymetricWeighting][intersect][${i}/${a.features.length}]`);
	
	/*if(i >= a.features.length-1)  {		
		const now = Math.floor(new Date() / 1000);
		fs.writeFile("C:\\Users\\debug_binary"+now+".json", JSON.stringify(d), function(err) { // Debugger
			if(err) {
				return console.log(err);
			}
			console.log("The file was saved!");
		}); 		
	}*/
	
	b.features.forEach(e => {
	  
	  let isIntersect = Turf.intersect(d, e);
	  
      if(isIntersect) {
		isIntersect = arealizeGeometryCollection(isIntersect);
        isIntersect.properties = d.properties;
        isIntersect.properties.parentArea = Turf.area(d);
        resultFeatures.push(isIntersect);
      }
    });
	// console.log(resultFeatures);
	// console.log(resultFeatures[0].geometry + ', ' + resultFeatures[0].properties);
	// console.log(Turf.point(resultFeatures[0].geometry[1]));
  });

  return Turf.featurecollection(resultFeatures);
}

module.exports = binaryDasymetricWeighting;
