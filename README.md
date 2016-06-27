# cogran.js

CoGran - A command line tool for combining data of different spatial granularity

**Note: Project is still under development.**


### Installation

To install the cli you need to clone the repository first.

```
$ git clone https://github.com/berlinermorgenpost/cogran.git
```

Now you need to install all dependencies for the application.

```
$ cd /path/to/cogran
$ npm install
```

Using the link command, we install cogran globally:

```
$ npm link
```

### Usage Examples

##### Aggregation Example

```
$ cogran -a -i test/data/base_data/sourcefeatures.geojson -t data/base_data/targetfeatures_hierarchical.geojson -o test/output.geojson --attr Aggr --mode sum
```

##### Areal Interpolation Example

1. Areal Weighting (done)

```
$ cogran --disaggregate --input test/data/base_data/sourcefeatures.geojson --target test/data/base_data/targetfeatures_hierarchical.geojson --output test/data/output.geojson --attr Aggr
```

2. Population Weighting (in development)

```
$ cogran --disaggregate --input test/data/base_data/sourcefeatures.geojson --target test/data/base_data/targetfeatures_hierarchical.geojson --output test/data/output.geojson --attr Aggr --weight population --mode populationWeighting
```

3. Binary Dasymetric Weighting (in development)

```
$ cogran --disaggregate --input test/data/base_data/sourcefeatures.geojson --target test/data/base_data/targetfeatures_hierarchical.geojson --output test/data/output.geojson --attr Aggr --weight population --mode binaryDasymetricWeighting --binary test/data/base_data/binarymask.geojson
```

4. N-Class Dasymetric Weighting (in development)

```
$ cogran --disaggregate --input test/data/base_data/sourcefeatures.geojson --target test/data/base_data/targetfeatures_hierarchical.geojson --output test/data/output.geojson --attr Aggr --weight population --mode nClassDasymetricWeighting --binary test/data/base_data/binarymask.geojson
```


### Options

You can specify these cli options:

* **--aggregate, -a** - Use aggregate mode
* **--disaggregate, -d** - Use disaggregate mode
* **--mode, -m** - The mode used for aggregating/disaggregating; aggregation: sum (default),min,average,median,min,max,deviation,variance,count; disaggregation: arealInterpolation (default)
* **--input, -i** - The input shapefile that will be used for aggregation/disaggregation
* **--target, -t** - The path of the target shapefile
* **--output, -o** - The path of the output zip file
* **--attr** - The attribute that will be used
* **--weight** - The attribute that is used for weighting (only for disaggregation)
* **--verbose** - Maximum log level
* **--silent** - disable logging

### Tests

To run tests with mocha:

```
$ npm test
```

### Todos

* [x] Add better logging
* [ ] Add disaggregation function
* [x] Add tests
* [ ] Find a solution for dealing with percentages and relative values
* [ ] Add better examples
* [ ] Number validation improvements
* [ ] Improve Documentation
* [ ] "Mode" should be renamed to "Method"

### Dependencies

* node.js 5.0 or higher
