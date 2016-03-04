'use strict';

const Expect = require('expect');
const Shapefile = require('shapefile');
const Aggregate = require('../lib/aggregate');

const config = {
  basic: { 
    input: './test/data/wahl/wahl.shp', 
    target: './test/data/mieten/mieten.shp',
    mode: 'sum',
    attr: 'BRFW'
  },

  missingTarget: {
    input: './test/data/wahl/wahl.shp' 
  },

  missingMode: { 
    input: './test/data/wahl/wahl.shp', 
    target: './test/data/mieten/mieten.shp',
    attr: 'BRFW'
  }
}

describe('aggregation module', () => {

  describe('return type', () => {

    let returnValue;

    beforeEach((cb) => {
      
      Aggregate(config.basic, (res) => {
        returnValue = res;
        cb();
      });
    
    });


    it('should be an object', () => {
      
      Expect(typeof returnValue).toBe('object');
    
    });

    it('should be a geojson feature collection', () => {
      
      Expect(returnValue.type).toBe('FeatureCollection');
    
    });
  
  });

  describe('output data', () => {

    let inputData, outputData;

    beforeEach((cb) => {

      Aggregate(config.basic, (res) => {
        outputData = res;

        Shapefile.read(config.basic.target, (err,inputJson) => {
          inputData = inputJson;
          cb();
        });
        
      });

    });


    it('should have the same number of features as the target file',() => {

      Expect(inputData.features.length).toBe(outputData.features.length);

    });

  });

  describe('error handling', () => {

    let returnValue;

    beforeEach((cb) => {

      Aggregate(config.missingMode, (res) => {
        returnValue = res;
        cb();
      });

    });

    it('should output an error if target parameter is missing', () => {
      let rV = Aggregate(config.missingTarget);
      Expect(typeof rV).toBe('string');
    });

    it('should default to sum if mode is missing', () => {
      Expect(typeof returnValue).toBe('object');
      Expect(returnValue.type).toBe('FeatureCollection');
    });

  });

});