'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');
const objectAssign = require('object-assign');
const shortid = require('shortid');
const d3 = require('d3');
const SiSt = require('simple-statistics');

function linearRegression(source, target, options, progress) {
  const nClassMask = objectAssign({}, options.binary);
  const SourceMask = intersect(source, nClassMask);

  target.features.forEach(d => {
    d.properties.targetId = shortid.generate();
  });

  SourceMask.features.forEach(d => {
    d.properties.Asc = Turf.area(d);
    d.properties.Psc = (d.properties.Asc / d.properties.parentArea) * d.properties[options.attr];
  });

  const regressionData = SourceMask.features.map(d => [d.properties.Asc, d.properties.Psc]);
  const regressionLine = SiSt.linearRegressionLine(SiSt.linearRegression(regressionData));

  const Atsc = intersect(SourceMask, target);

  Atsc.features.forEach(d => {
    d.properties.Ptx = regressionLine(Turf.area(d));
  });

  target.features.forEach(d => {
    const matchingFeatures = Atsc.features.filter(f => f.properties.targetId == d.properties.targetId);

    let Pt = 0;
    matchingFeatures.forEach(f => {
      Pt += f.properties.Ptx;
    });

    d.properties[options.attr] = Pt;

    delete d.properties.targetId;
  });

  return target;
}

function intersect(a, b) {

  let resultFeatures = [];

  a.features.forEach(d => {
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
