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
    mode: 'populationWeighting'
  },
  
  hierarch_rel: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_hierarchical.geojson'),
    attr: 'Aggr_rel',
    weight: 'population',
    mode: 'populationWeighting'
  },

  nonHierarch_abs: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr',
    weight: 'population',
    mode: 'populationWeighting'
  },

  nonHierarch_rel: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr_rel',
    weight: 'population',
    mode: 'populationWeighting'
  }
}

describe('population weighting [hierarchical, absolute]', () => {

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
      Expect(Math.round(outputData.features[0].properties[Config.hierarch_abs.attr])).toBeGreaterThan(36).toBeLessThan(38);
      Expect(Math.round(outputData.features[1].properties[Config.hierarch_abs.attr])).toBe(15);
    });

  });

});

describe('population weighting [hierarchical, relative]', () => {

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
      Expect(outputData.features[0].properties[Config.hierarch_rel.attr]).toBeGreaterThan(13).toBeLessThan(14);
      Expect(outputData.features[1].properties[Config.hierarch_rel.attr]).toBeGreaterThan(1.4).toBeLessThan(1.6);
    });

  });

});



describe('population weighting [nonhierarchical, absolute]', () => {

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
      Expect(outputData.features[0].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(45).toBeLessThan(46);
      Expect(outputData.features[1].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(3).toBeLessThan(4);
    });

  });

});


describe('population weighting [nonhierarchical, relative]', () => {

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
      Expect(outputData.features[0].properties[Config.nonHierarch_rel.attr]).toBeGreaterThan(23).toBeLessThan(24);
      Expect(outputData.features[1].properties[Config.nonHierarch_rel.attr]).toBeGreaterThan(0).toBeLessThan(1);
    });

  });

});