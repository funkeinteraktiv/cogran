'use strict'
/*
* Cogran.js
* A command line tool for working with geodata.
*
* index.js
* The entry point of the application. Parses user arguments and executes the desired code.
*/
let pckg = require('./package.json');
let optimist = require('optimist');

let argv = optimist
  .usage('Usage: cogran --input <input_shape.shp> --target <target_shape.shp> --output <output_shape.shp> --attr <attribute_name>')
  .options('i', {
    alias: 'input',
    describe: 'The input shapefile that will be aggregated'
  })
  .check((argv) => {
    if(argv.help) return optimist.showHelp();
    if(argv.version) return console.log(pckg.version);
  })
  .argv;
