'use strict';
/*
* cogran-areal-interpolate.js
* A function that disaggregates data from an input shapefile to a target shapefile.
*/
const Path = require('path');
const Turf = require('turf');
const cloneDeep = require('lodash/cloneDeep');
const InterpolationMethods = require('./methods');
const Progress = require('progress');
const Logger = require('./logger');
const Errors = require('./errors');
const FileLoader = require('./fileloader');
const objectAssign = require('object-assign');

function arealInterpolate(args, cb) {
  if(args.mode == 'binaryDasymetricWeighting' || args.mode == 'nClassDasymetricWeighting'|| args.mode == 'linearRegression') {
    FileLoader.readGeoJson([args.mask], function(err, res) {
      args.binary = res[0];
      onReady(args, cb);
    });
  }
  else {
    onReady(args, cb);
  }
}

function onReady(args, cb) {
  if(Path.extname(args.input) == '.shp' && Path.extname(args.target) == '.shp') {
    FileLoader.readShapefiles([args.input, args.target], getAggregationFunction(args, cb));
  }
  else {
    FileLoader.readGeoJson([args.input, args.target], getAggregationFunction(args, cb));
  }
}

function getAggregationFunction(args, cb) {
  return function(err, res) {
    if(err) {
      return Logger.error(err);
    }

    args.mode = args.mode || 'arealWeighting';

    let source = res[0];
    const target = cloneDeep(res[1]);

    if(!validate(source, target, args)) {
      return Logger.error(Errors.cogranFailed);
    }

    Logger.info(`source file: ${source.features.length} features`);
    Logger.info(`target file: ${target.features.length} features`);

    let Bar;

    if(!args.silent) {
      Bar = new Progress('generating [:bar] :percent', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: target.features.length
      });
    }

    Logger.info(`running areal interpolation with mode: ${args.mode}`);


    const result = InterpolationMethods[args.mode](source, target, args, Bar);

    // target.features.forEach((feature,i) => {
    //   feature.properties[args.attr] = InterpolationMethods[args.mode](feature, source, args);

    //   if(!args.silent) { Bar.tick(1) };
    // });

    // const result = target;

    return cb(result);
  }
}

function validate(source, target, args) {
  let isValidated = true;

  if(!validateArgs(args)) {
    Logger.error(Errors.missingArgument);
    isValidated = false;
  }

  if(!validateSource(source, args)) {
    Logger.error(Errors.missingSourceAttr);
    isValidated = false;
  }

  if(!validateTarget(target, args)) {
    Logger.error(Errors.missingTargetAttr);
    isValidated = false;
  }

  return isValidated;
}

function validateArgs(args) {
  return typeof args.input != 'undefined' &&
      typeof args.target != 'undefined';
}

function validateSource(source, args) {
  return typeof source !== 'undefined' &&
      typeof source.features !== 'undefined' &&
      typeof source.features[0].properties[args.attr] !== 'undefined';
}

function validateTarget(target, args) {
  return typeof target !== 'undefined' &&
      typeof target.features !== 'undefined';
}

module.exports = arealInterpolate;
