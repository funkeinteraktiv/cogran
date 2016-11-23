#! /usr/bin/env node

'use strict'
/*
* Cogran.js
* A command line tool for working with geodata.
*
* index.js
* The entry point of the application. Parses user arguments and executes the desired code.
*/
const Optimist = require('optimist');
const ArealInterpolate = require('./lib/areal-interpolate');
const FileWriter = require('./lib/filewriter');
const Pckg = require('./package.json');
const Errors = require('./lib/errors');
const Logger = require('./lib/logger');

let argv = Optimist
  .usage('Usage: cogran --input <input_shape.shp> --target <target_shape.shp> --output <output_shape.shp> --attr <attribute_name>')
  .options('d', {
    describe: 'Use (dis)aggregate mode'
  })
  .options('i', {
    alias: 'input',
    describe: 'path and name of the input geojson that will be used for aggregation/disaggregation',
    demand: true
  })
  .options('t', {
    alias: 'target',
    describe: 'path and name of the target geojson',
    demand: true
  })
  .options('o', {
    alias: 'output',
    describe: 'path and name of the output geojson'
  })
  .options('attr', {
    describe: 'The attribute that will be used',
    demand: true
  })
  .options('m', {
    alias: 'mode',
    describe: 'Possible values: arealWeightingAdvanced, arealWeightingRelative, attributeWeighting, attributeWeightingAdvanced, attributeWeightingRelative, binaryDasymetricWeighting, binaryDasymetricWeightingRelative, nClassDasymetricWeighting, nClassDasymetricWeightingRelative, linearRegression'
  })
  .options('mask', {
    describe: 'path and name of the geojson with ancillary information'
  })
  .options('weight', {
    describe: 'The attribute from target geojson that is used for weighting'
  })
  .check(main)
  .argv;

function main(argv) {
  if(argv.help) return Optimist.showHelp();
  if(argv.version) return Logger.log(Pckg.version);
  return ArealInterpolate(argv, res => {
    if(argv.output) {
      FileWriter.write(res, argv.output);
    }
    else {
      Logger.info('no output file specified');
    }
  });

  return Optimist.showHelp();
}
