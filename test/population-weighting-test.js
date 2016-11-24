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
    weight: 'population',
    mode: 'attributeWeighting'
  },

  hierarch_rel: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_hierarchical.geojson'),
    attr: 'Aggr',
    weight: 'population',
    mode: 'attributeWeightingRelative'
  },

  nonHierarch_abs: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr',
    weight: 'population',
    mode: 'attributeWeighting'
  },

  nonHierarch_rel: {
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr_rel',
    weight: 'population',
    mode: 'attributeWeightingRelative'
  }
}

describe('attribute weighting [hierarchical, absolute]', () => {

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
      Expect(outputData.features[0].properties[Config.hierarch_abs.attr]).toBeGreaterThan(14).toBeLessThan(16);
      Expect(outputData.features[1].properties[Config.hierarch_abs.attr]).toBeGreaterThan(61).toBeLessThan(63);
    });

  });

});

describe('attribute weighting [hierarchical, relative]', () => {

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
      Expect(outputData.features[0].properties[Config.hierarch_rel.attr]).toBe(15)//.toBeLessThan(1.6);
      Expect(outputData.features[1].properties[Config.hierarch_rel.attr]).toBe(62);
    });

  });

});



describe('attribute weighting [nonhierarchical, absolute]', () => {

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
      Expect(outputData.features[0].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(9.2).toBeLessThan(9.3);
      Expect(outputData.features[1].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(67).toBeLessThan(68);
    });

  });

});


describe('attribute weighting [nonhierarchical, relative]', () => {

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
      Expect(outputData.features[0].properties[Config.nonHierarch_rel.attr]).toBeGreaterThan(2.7).toBeLessThan(2.8);
      Expect(outputData.features[1].properties[Config.nonHierarch_rel.attr]).toBeGreaterThan(29).toBeLessThan(30);
    });

  });

});
