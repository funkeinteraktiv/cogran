'use strict';

const Expect = require('expect');
const Path = require('path');
const Aggregate = require('../lib/areal-interpolate');
const FileLoader = require('../lib/fileloader');

const Config = {
  hierarch_abs: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_hierarchical.geojson'),
    attr: 'Aggr',
    binary: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'linearRegression'
  },
  
  hierarch_rel: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_hierarchical.geojson'),
    attr: 'Aggr_rel',
    binary: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'linearRegression'
  },

  nonHierarch_abs: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr',
    binary: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'linearRegression'
  },

  nonHierarch_rel: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr_rel',
    binary: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'linearRegression'
  }
}

describe('linear regression [hierarchical, absolute]', () => {

  describe('output data', () => {

    let inputData, outputData;

    beforeEach((cb) => {

      Aggregate(Config.hierarch_abs, (res) => {
        outputData = res;
        FileLoader.readGeoJson([Config.hierarch_abs.target], (err, res) => {
          inputData = res[0];
          cb();
        });
      });

    });

    it('should calculate the ouput values correctly',() => {
      Expect(outputData.features[0].properties[Config.hierarch_abs.attr]).toBeGreaterThan(10.4).toBeLessThan(10.5);
      Expect(outputData.features[1].properties[Config.hierarch_abs.attr]).toBeGreaterThan(36.6).toBeLessThan(36.7);
    });

  });

});