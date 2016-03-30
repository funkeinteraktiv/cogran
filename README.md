# cogran.js

A command line tool for working with aggregations.

**Note: Project is under development.**


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

### Usage

**Aggregation Example**

```
$ cogran --aggregate --input test/data/kriminalitaet/kriminalitaet_Bezirksregionen.shp --target test/data/bezirke/RBS_OD_BEZ_1412.shp --output test/data/output/agg-test.zip --attr "Alle_2012" -m sum
```

**Areal Interpolation Examples**

This example uses *Areal Weighting* to disaggregate crime data into smaller areas:

```
$ cogran --disaggregate --input test/data/kriminalitaet/kriminalitaet_wgs84.shp --target test/data/mieten/mieten.shp --output test/data/output/disagg-test.zip --attr "Alle_2012"
```

This example uses *Population Weighting* to disaggregate crime data into smaller areas that have a population attribute:

```
$ cogran --disaggregate --input test/data/kriminalitaet/kriminalitaet_wgs84.shp --target test/data/zugezogene_plraeume/zugezogene_Plraeume_wgs84.shp --output test/data/output/disagg-popweight-test.zip --attr "Alle_2012" --weight "Einwohner" --mode populationWeighting
```

**Help**

Prints out the available cli options

```
$ cogran --help
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
