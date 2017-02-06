'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');
const objectAssign = require('object-assign');
const shortid = require('shortid');
const Logger = require('../logger');
const d3 = require('d3');
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
	var arealFeature = JSON.parse(JSON.stringify(gc)); // wtf javascript... is this how you clone?
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
		console.log("No valid geometries, maybe return null?!") // TODO
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

function nClassDasymetricWeighting(source, target, options) {
  let s = 0;
  source.features.forEach(d => {
    const attrValue = parseFloat(d.properties[options.attr]);
    if(!isNaN(attrValue)) {
      s += attrValue;
    }
  });

  const nClassMask = objectAssign({}, options.binary);

  let percentageSum = 0;   
  nClassMask.features.forEach(d => {
    percentageSum += d.properties.percentage;
	//console.log("maskArea: " + Turf.area(d));
	//console.log("percentage: " + JSON.stringify(d.properties.percentage));
  });
  
  //console.log("percentageSum: " + percentageSum);

  nClassMask.features.forEach(d => {
	d.properties.Pc = s * (d.properties.percentage / percentageSum);
	//console.log("Pc: " + JSON.stringify(d.properties.Pc));
    d.properties.maskId = shortid.generate();
  });

  target.features.forEach(d => {
    d.properties.targetId = shortid.generate();
  });

  const Asc = intersectSourceMask(source, nClassMask);
  const Atsc = intersect(Asc, target);
  const Atscm = dissolve(Atsc);

  Atscm.features.forEach(d => {
	/*console.log("Atsc: " + Turf.area(Atsc));
	console.log("d: " + Turf.area(d));
	console.log("maskArea: " + d.properties.maskArea);
	console.log("maskArea * Pc: " + d.properties.maskArea * d.properties.Pc);*/
	d.properties.Ptx = Turf.area(d) / d.properties.maskArea * d.properties.Pc;
	/*console.log("Ptx: " + (Turf.area(d) / Turf.area(Asc) * d.properties.Pc));
	console.log("------------------------------------------------------");*/
  });
  
  target.features.forEach(d => {
    const matchingFeatures = Atscm.features.filter(f => f.properties.targetId == d.properties.targetId);

    let Pt = 0;
    matchingFeatures.forEach(f => {
      Pt += f.properties.Ptx;
		console.log("Pt: " + Pt);
    });

    d.properties[options.attr] = Pt;
    delete d.properties.targetId; //deletes attribute "targetId" from target-File
	delete d.properties.i;
  });

  return target;
}

function dropTinyAreas(features){
	var new_fc = new Array();
	var count = 0;

	for (var i=0; i< features.length; i++){
		if (Turf.area(features[i]) > 20) {
			new_fc.push(features[i]);
		}
		else {
			count = count +1;
			console.log('Dropping Tiny Feature.');
		}
	}
	
	console.log("Dropping feature with tiny area: " + count +'/' + features.length); 
	return new_fc;
}

function dissolve(fc) {
	//console.log("fc: " + fc.features.length);

	/*
	fs.writeFile("C:\\Users\\debug_nclass"+now+".json", JSON.stringify(fc), function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});
	*/

  const resultFeatures = [];

  const nested = d3.nest()
    .key(d => `${d.properties.targetId}_${d.properties.maskId}`)
    .entries(
		//fc.features
		dropTinyAreas(fc.features)
	);

  nested.forEach((d, i) => {
		
	/* for(var j; j < d.values.length; j++){
		// console.log('Areas: ' + Turf.area(d.values[j]));
	}*/

    Logger.info(`[nClassDasymetricWeighting][dissolve][${i}/${nested.length}]`);

    if(d.values.length == 1) {
      resultFeatures.push(d.values[0]);
    }
	 else if(d.values.length >= 2) {
       resultFeatures.push(union(d.values));
     }
  });

  return Turf.featurecollection(resultFeatures);
}

function union(features) {
  let result = null;

  for(var i = 0; i < features.length; i++) {
    if(i == 0) {
      result = features[0];
    } else {
      result = Turf.union(result, features[i]);
    }
  }

  return result;
}

function intersectSourceMask(a, b) {

  const resultFeatures = [];

  for(let i = 0; i < a.features.length; i++) {
    Logger.info(`[nClassDasymetricWeighting][intersectSourceMask][${i}/${a.features.length}]`);

    for(let j = 0; j < b.features.length; j++) {
      const d = a.features[i];
      const e = b.features[j];

      let isIntersect = Turf.intersect(d, e);

      if(isIntersect) {
		isIntersect = arealizeGeometryCollection(isIntersect);
        isIntersect.properties = objectAssign({}, d.properties, e.properties, { maskArea: Turf.area(e) });
        resultFeatures.push(isIntersect);
	  }
    }
  }

  return Turf.featurecollection(resultFeatures);
}

function intersect(a, b) {

  let resultFeatures = [];

  a.features.forEach((d, i) => {
    Logger.info(`[nClassDasymetricWeighting][intersect][${i}/${a.features.length}]`);

    b.features.forEach(e => {

	  let isIntersect = Turf.intersect(d, e);

      if(isIntersect && Turf.area(isIntersect) > 0) {
		isIntersect = arealizeGeometryCollection(isIntersect);
        isIntersect.properties = objectAssign({}, d.properties, e.properties)
        resultFeatures.push(isIntersect);
      }

    });
  });

  const FeatureCollection = Turf.featurecollection(resultFeatures);
  return FeatureCollection;

}

module.exports = nClassDasymetricWeighting;
