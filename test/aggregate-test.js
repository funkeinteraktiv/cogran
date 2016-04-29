'use strict';

const Expect = require('expect');
const Path = require('path');
const Aggregate = require('../lib/aggregate');

const Config = {
  basic: { 
    input: Path.resolve(__dirname, 'data/base_data/binarymask.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/binarymask.geojson'),
    mode: 'sum',
    attr: 'BRFW'
  },

  missingTarget: {
    input: Path.resolve(__dirname, 'data/base_data/binarymask.geojson'),
  },

  missingMode: { 
    input: Path.resolve(__dirname, 'data/base_data/binarymask.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/binarymask.geojson'),
    attr: 'BRFW'
  }
}

describe('aggregation module', () => {

  describe('return type', () => {

    let returnValue;

    beforeEach((cb) => {
      
      Aggregate(Config.basic, (res) => {
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

  // describe('output data', () => {

  //   let inputData, outputData;

  //   beforeEach((cb) => {

  //     Aggregate(Config.basic, (res) => {
  //       outputData = res;
  //       inputData = require(Config.basic.target);
  //       cb();
  //     });

  //   });


  //   it('should have the same number of features as the target file',() => {

  //     Expect(inputData.features.length).toBe(outputData.features.length);

  //   });

  // });

  describe('error handling', () => {

    let returnValue;

    beforeEach((cb) => {

      Aggregate(Config.missingMode, (res) => {
        returnValue = res;
        cb();
      });

    });

    it('should output an error if target parameter is missing', () => {
      let rV = Aggregate(Config.missingTarget);
      Expect(typeof rV).toBe('string');
    });

    it('should default to sum if mode is missing', () => {
      Expect(typeof returnValue).toBe('object');
      Expect(returnValue.type).toBe('FeatureCollection');
    });

  });

});