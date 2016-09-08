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
    mode: 'nClassDasymetricWeighting',
    nclass: 'landuse'
  },

  nonHierarch_abs: { 
    input: Path.resolve(__dirname, 'data/base_data/sourcefeatures.geojson'),
    target: Path.resolve(__dirname, 'data/base_data/targetfeatures_nonhierarchical.geojson'),
    attr: 'Aggr',
    binary: Path.resolve(__dirname, 'data/base_data/nclassmask.geojson'),
    mode: 'nClassDasymetricWeighting',
    nclass: 'landuse'
  }
}

describe('n-class-dasymetric-weighting [hierarchical, absolute]', () => {

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
      Expect(Math.round(outputData.features[0].properties[Config.hierarch_abs.attr])).toBe(62);
      Expect(Math.round(outputData.features[1].properties[Config.hierarch_abs.attr])).toBe(15);
    });

  });

});

describe('n-class-dasymetric-weighting [nonhierarchical, absolute]', () => {

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
      Expect(outputData.features[0].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(45).toBeLessThan(46);
      Expect(outputData.features[1].properties[Config.nonHierarch_abs.attr]).toBeGreaterThan(3).toBeLessThan(4);
    });

  });

});
