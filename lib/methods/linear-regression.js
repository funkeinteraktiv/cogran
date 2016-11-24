'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');
const Logger = require('../logger');
const objectAssign = require('object-assign');
const shortid = require('shortid');
const d3 = require('d3');
const SiSt = require('simple-statistics');

function linearRegression(source, target, options, progress) {

  const nClassMask = objectAssign({}, options.binary);
  // console.log(nClassMask);
  // console.log("landuse: " + nClassMask.features[0].properties.landuse);
  const SourceMask = intersect(source, nClassMask);
  // console.log(SourceMask);
  // console.log(SourceMask.features[0].properties);

  target.features.forEach(d => {
    d.properties.targetId = shortid.generate();
  });

  SourceMask.features.forEach(d => { // d = SourceMask.features[0..X];
   d.properties.Asc = Turf.area(d);
   d.properties.Psc = (d.properties.Asc / d.properties.parentArea) * d.properties[options.attr];
  });

  const regressionData = SourceMask.features.map(d => [d.properties.class, d.properties.Asc, d.properties.Psc]);
  // console.log('reg.Data: ' +regressionData);

  const Atsc = intersect(SourceMask, target);

  /* neuen Flächeninhalt [m^2] berechnen */
  Atsc.features.forEach(d => { // d = SourceMask.features[0..X];
   d.properties.Atsc = Turf.area(d);
 });

  //
  // distinct() für landuse-typen in regressiondata => n
  // for(i<n) => const landuse + 'i';

  var distinct = [];
  for(var i=0; i< regressionData.length; i++){
	  if (distinct.includes(regressionData[i][0]) == false){
		distinct.push(regressionData[i][0]);
	  }
  }

  for(var i=0; i< distinct.length; i++){
	  this['class' +i] = [];
	  for(var j=0; j< regressionData.length; j++){
		if(regressionData[j][0] == distinct[i]){
		  this['class' +i].push(new Array(regressionData[j][1], regressionData[j][2]));
	    }
	  }

	  this['regressionLine' +i] = SiSt.linearRegressionLine(SiSt.linearRegression(this['class' +i]));
  }

  for(var i=0; i< distinct.length; i++){
	  this['Atsc' +i] = [];
	  for(var j=0; j< Atsc.features.length; j++){
		  if(Atsc.features[j].properties.class == distinct[i]){
			  Atsc.features[j].properties.Ptx = this['regressionLine' +i](Atsc.features[j].properties.Atsc);
		  }
	  }
  }

  target.features.forEach(d => {
	d.properties.Pt = 0;

	for(var i=0; i< Atsc.features.length; i++){
		if(Atsc.features[i].properties.targetId == d.properties.targetId){
			d.properties.Pt += Atsc.features[i].properties.Ptx;
		}
	}

    delete d.properties.targetId;
		d.properties[options.attr] = d.properties.Pt;
  }
);

  return target;
}

function intersect(a, b) {

  let resultFeatures = [];

  a.features.forEach((d, i) => {

    Logger.info(`[linearRegression][intersect][${i}/${a.features.length}]`);

    b.features.forEach(e => {
      const isIntersect = Turf.intersect(d, e);

      if(isIntersect && Turf.area(isIntersect) > 0) {
        isIntersect.properties = objectAssign({}, e.properties, d.properties);
        isIntersect.properties.parentArea = Turf.area(d);
        resultFeatures.push(isIntersect);
      }
    });
  });

  return Turf.featurecollection(resultFeatures);
}

module.exports = linearRegression;
