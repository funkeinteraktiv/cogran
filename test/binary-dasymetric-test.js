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
    mask: Path.resolve(__dirname, 'data/base_data/binarymask.geojson'),
    mode: 'binaryDasymetricWeighting'
  },

  hierarch_rel: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_hierarchical.geojson'),
    attr: 'Relative',
    mask: Path.resolve(__dirname, 'data/base_data/binarymask.geojson'),
    mode: 'binaryDasymetricWeightingRelative'
  },

  nonHierarch_abs: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr',
    mask: Path.resolve(__dirname, 'data/base_data/binarymask.geojson'),
    mode: 'binaryDasymetricWeighting'
  },

  nonHierarch_rel: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Relative',
    mask: Path.resolve(__dirname, 'data/base_data/binarymask.geojson'),
    mode: 'binaryDasymetricWeightingRelative'
  }
}

describe('binary dasymetric weighting [hierarchical, absolute]', () => {

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
      Expect(Math.round(outputData.features[0].properties[Config.hierarch_abs.attr])).toBe(15);
      Expect(Math.round(outputData.features[1].properties[Config.hierarch_abs.attr])).toBe(42);
    });

  });

});

describe('binary dasymetric weighting [hierarchical, relative]', () => {

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
      Expect(outputData.features[0].properties[Config.hierarch_rel.attr]).toBeGreaterThan(5.19).toBeLessThan(5.2);
      Expect(outputData.features[1].properties[Config.hierarch_rel.attr]).toBeGreaterThan(4.86).toBeLessThan(4.9);
    });

  });

});



describe('binary dasymetric weighting [nonhierarchical, absolute]', () => {

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
      Expect(outputData.features[0].properties[Config.nonHierarch_abs.attr]).toBe(0);
      Expect(outputData.features[1].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(14.1).toBeLessThan(14.2);
    });

  });

});


describe('binary dasymetric weighting [nonhierarchical, relative]', () => {

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
      Expect(outputData.features[0].properties[Config.nonHierarch_rel.attr]).toBe(0);
      Expect(outputData.features[1].properties[Config.nonHierarch_rel.attr]).toBeGreaterThan(1.99).toBeLessThan(2);
    });

  });

});
