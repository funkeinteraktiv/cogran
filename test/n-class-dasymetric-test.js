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
    mode: 'nClassDasymetricWeighting'
  },

  hierarch_rel: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_hierarchical.geojson'),
    attr: 'Aggr',
    mask: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'nClassDasymetricWeightingRelative'
  },

  nonHierarch_abs: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr',
    mask: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'nClassDasymetricWeighting'
  },

  nonHierarch_rel: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr_rel',
    mask: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'nClassDasymetricWeighting'
  }
}

describe('nclass dasymetric weighting [hierarchical, absolute]', () => {

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

describe('nclass dasymetric weighting [hierarchical, relative]', () => {

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

    it('should calculate the ouput values correctly',() => {
      Expect(outputData.features[0].properties[Config.hierarch_rel.attr]).toBeGreaterThan(15.88).toBeLessThan(15.9);
      Expect(outputData.features[1].properties[Config.hierarch_rel.attr]).toBeGreaterThan(36.91).toBeLessThan(36.92);
    });

  });

});



describe('nclass dasymetric weighting [nonhierarchical, absolute]', () => {

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

    it('should calculate the ouput values correctly',() => {
      Expect(outputData.features[0].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(2.6).toBeLessThan(2.7);
      Expect(outputData.features[1].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(22.8).toBeLessThan(22.9);
    });

  });

});


describe('nclass dasymetric weighting [nonhierarchical, relative]', () => {

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

    it('should calculate the ouput values correctly',() => {
      Expect(outputData.features[0].properties[Config.nonHierarch_rel.attr]).toBeGreaterThan(1.1).toBeLessThan(1.2);
      Expect(outputData.features[1].properties[Config.nonHierarch_rel.attr]).toBeGreaterThan(9.5).toBeLessThan(9.6);
    });

  });

});
