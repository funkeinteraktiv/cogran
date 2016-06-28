'use strict';

const Expect = require('expect');
const Path = require('path');
const Aggregate = require('../lib/aggregate');
const FileLoader = require('../lib/fileloader');

const Config = {
  basic: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_hierarchical.geojson'),
    mode: 'sum',
    attr: 'Aggr'
  },

  missingTarget: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
  },

  missingMode: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_hierarchical.geojson'),
    attr: 'Aggr'
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

  describe('output data', () => {

    let inputData, outputData;

    beforeEach((cb) => {

      Aggregate(Config.basic, (res) => {
        outputData = res;
        FileLoader.readGeoJson([Config.basic.target], (err, res) => {
          inputData = res[0];
          cb();
        });
      });

    });


    it('should have the same number of features as the source file',() => {

      Expect(inputData.features.length).toBe(outputData.features.length);

    });

    it('should inherit the attribute that is aggregated',() => {
      
      Expect(typeof outputData.features[0].properties[Config.basic.attr]).toBe('number');

    });

    it('should calculate the ouput values correctly',() => {
      
      Expect(Math.round(outputData.features[0].properties[Config.basic.attr])).toBe(15);
      Expect(Math.round(outputData.features[1].properties[Config.basic.attr])).toBe(62);

    });

  });

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