#! /usr/bin/env node

'use strict'
/*
* Cogran.js
* A command line tool for working with geodata.
*
* index.js
* The entry point of the application. Parses user arguments and executes the desired code.
*/
let optimist = require('optimist');
let aggregate = require('./lib/aggregate');
let fileWriter = require('./lib/filewriter');
let pckg = require('./package.json');
let errors = require('./lib/errors');
let logger = require('./lib/logger');

let argv = optimist
  .usage('Usage: cogran --aggregate --input <input_shape.shp> --target <target_shape.shp> --output <output_shape.shp> --attr <attribute_name>')
  .options('a', {
    alias: 'aggregate',
    describe: 'Use aggregate mode'
  })
  .options('d', {
    alias: 'disaggregate',
    describe: 'Use disaggregate mode'
  })
  .options('m', {
    alias: 'mode',
    describe: 'The mode used for aggregating/disaggregating, can be: sum,min,average,median,min,max,deviation,variance,count',
    default: 'sum'
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
  .check(main)
  .argv;

function main(argv) {
  if(argv.help) return optimist.showHelp();
  if(argv.version) return logger.log(pckg.version);
  if(argv.aggregate) {
    return aggregate(argv, (res) => {
      if(argv.output) {
        fileWriter.write(res, argv.output); 
      }
      else {
        logger.info('no output file specified');
      }
    });
  }
  if(argv.disaggregate) {
    throw errors.notImplementedYetError
  }

  return optimist.showHelp();
}