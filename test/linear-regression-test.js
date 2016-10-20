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

  hierarch_rel: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_hierarchical.geojson'),
    attr: 'Aggr_rel',
    mask: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'linearRegression'
  },

  nonHierarch_abs: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr',
    mask: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'linearRegression'
  },

  nonHierarch_rel: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr_rel',
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
      Expect(outputData.features[0].properties[Config.hierarch_abs.attr]).toBeGreaterThan(16).toBeLessThan(17);
      Expect(outputData.features[1].properties[Config.hierarch_abs.attr]).toBeGreaterThan(56).toBeLessThan(57);
    });

  });

});

describe('linear regression [hierarchical, relative]', () => {

  describe('output data', () => {

    let inputData, outputData;

    beforeEach((cb) => {

      Aggregate(Config.hierarch_rel, (res) => {
        outputData = res;
        FileLoader.readGeoJson([Config.hierarch_rel.target], (err, res) => {
          inputData = res[0];
          cb();
        });
      });

    });

    it('should calculate the output values correctly',() => {
      Expect(outputData.features[0].properties[Config.hierarch_rel.attr]).toBeGreaterThan(8).toBeLessThan(9);
      Expect(outputData.features[1].properties[Config.hierarch_rel.attr]).toBeGreaterThan(22).toBeLessThan(23);
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
      Expect(outputData.features[0].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(4).toBeLessThan(5);
      Expect(outputData.features[1].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(60).toBeLessThan(61);
    });

  });

});

describe('linear regression [nonhierarchical, relative]', () => {

  describe('output data', () => {

    let inputData, outputData;

    beforeEach((cb) => {

      Aggregate(Config.nonHierarch_rel, (res) => {
        outputData = res;
        FileLoader.readGeoJson([Config.nonHierarch_rel.target], (err, res) => {
          inputData = res[0];
          cb();
        });
      });

    });

    it('should calculate the output values correctly',() => {
      Expect(outputData.features[0].properties[Config.nonHierarch_rel.attr]).toBeGreaterThan(3).toBeLessThan(4);
      Expect(outputData.features[1].properties[Config.nonHierarch_rel.attr]).toBeGreaterThan(32).toBeLessThan(33);
    });

  });

});