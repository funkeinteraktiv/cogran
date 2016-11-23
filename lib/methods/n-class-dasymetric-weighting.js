'use strict';

const Turf = require('turf');
const isUndefined = require('lodash/isUndefined');
const objectAssign = require('object-assign');
const shortid = require('shortid');
const Logger = require('../logger');
const d3 = require('d3');

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
  });

  nClassMask.features.forEach(d => {
    d.properties.Pc = s * (d.properties.percentage / percentageSum);
    d.properties.maskId = shortid.generate();
  });

  target.features.forEach(d => {
    d.properties.targetId = shortid.generate();
  });

  const Asc = intersectSourceMask(source, nClassMask);
  const Atsc = intersect(Asc, target);
  const Atscm = dissolve(Atsc);

  Atscm.features.forEach(d => {
    d.properties.Ptx = Turf.area(d) / d.properties.maskArea * d.properties.Pc;
  });

  target.features.forEach(d => {
    const matchingFeatures = Atscm.features.filter(f => f.properties.targetId == d.properties.targetId);

    let Pt = 0;
    matchingFeatures.forEach(f => {
      Pt += f.properties.Ptx;
    });

    d.properties[options.attr] = Pt;
    delete d.properties.targetId; //löscht Attribut "targetId" aus target-File
  });

  return target;
}

function dissolve(fc) {
  const resultFeatures = [];

  const nested = d3.nest()
    .key(d => `${d.properties.targetId}_${d.properties.maskId}`)
    .entries(fc.features);

  nested.forEach((d, i) => {

    Logger.info(`[nClassDasymetricWeighting][dissolve][${i}/${nested.length}]`);

    if(d.values.length == 1) {
      resultFeatures.push(d.values[0]);
    } else if(d.values.length >= 2) {
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

      const isIntersect = Turf.intersect(d, e);

      if(isIntersect) {
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
      const isIntersect = Turf.intersect(d, e);

      if(isIntersect && Turf.area(isIntersect) > 0) {
        isIntersect.properties = objectAssign({}, d.properties, e.properties)
        resultFeatures.push(isIntersect);
      }
    });
  });

  const FeatureCollection = Turf.featurecollection(resultFeatures);
  return FeatureCollection;
}

module.exports = nClassDasymetricWeighting;
