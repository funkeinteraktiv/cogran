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
    mask: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'linearRegression'
  },

  nonHierarch_abs: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr',
    mask: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
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

    it('should calculate the output values correctly',() => {
      Expect(outputData.features[0].properties[Config.hierarch_abs.attr]).toBeGreaterThan(16.5).toBeLessThan(16.6);
      Expect(outputData.features[1].properties[Config.hierarch_abs.attr]).toBeGreaterThan(56.5).toBeLessThan(56.6);
    });

  });

});

describe('linear regression [nonhierarchical, absolute]', () => {

  describe('output data', () => {

    let inputData, outputData;

    beforeEach((cb) => {

      Aggregate(Config.nonHierarch_abs, (res) => {
        outputData = res;
        FileLoader.readGeoJson([Config.nonHierarch_abs.target], (err, res) => {
          inputData = res[0];
          cb();
        });
      });

    });

    it('should calculate the output values correctly',() => {
      Expect(outputData.features[0].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(4.2).toBeLessThan(4.3);
      Expect(outputData.features[1].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(60.4).toBeLessThan(60.5);
    });

  });

});
