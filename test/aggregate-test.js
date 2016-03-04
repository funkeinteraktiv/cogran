'use strict';

const Expect = require('expect');
const Aggregate = require('../lib/aggregate');
const Async = require('async');

const aggConfigs = {
  basic: { 
    input: './test/data/wahl/wahl.shp', 
    target: './test/data/mieten/mieten.shp',
    mode: 'sum',
    attr: 'BRFW'
  }
}

describe('aggregation module', () => {

  describe('return type', () => {

    let returnValue;

    beforeEach((cb) => {
      
      Aggregate(aggConfigs.basic, (res) => {
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

});