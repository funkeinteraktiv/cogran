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
const Aggregate = require('./lib/aggregate');
const ArealInterpolate = require('./lib/areal-interpolate');
const FileWriter = require('./lib/filewriter');
const Pckg = require('./package.json');
const Errors = require('./lib/errors');
const Logger = require('./lib/logger');

let argv = Optimist
  .usage('Usage: cogran --input <input_shape.shp> --target <target_shape.shp> --output <output_shape.shp> --attr <attribute_name>')
  .options('m', {
    alias: 'mode',
    describe: 'The mode used for aggregating/disaggregating, \n aggregation: sum (default),min,average,median,min,max,deviation,variance,count \n disaggregation: arealInterpolation (default)'
  })
  .options('i', {
    alias: 'input',
    describe: 'The input shapefile that will be used for aggregation/disaggregation',
    demand: true
  })
  .options('t', {
    alias: 'target',
    describe: 'The path of the target shapefile',
    demand: true
  })
  .options('o', {
    alias: 'output',
    describe: 'The path of the output zip file'
  })
  .options('attr', {
    describe: 'The attribute that will be used',
    demand: true
  })
  .options('verbose', {
    describe: 'Log debug information to the console'
  })
  .options('silent', {
    describe: 'Don\'t print anything to the console'
  })
  .options('examples', {
    describe: 'List some usage examples'
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
  // }

  return Optimist.showHelp();
}
