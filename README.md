# cogran.js

CoGran - A command line tool for combining data of different spatial granularity  
  
  
**Note: Project is still under development.**
  
  
## Installation

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

## Usage Examples



Note: No String datatypes are allowed for attribute values (use Int or Real instead)


###&nbsp;  1. Simple Area Weighting
weights the attribute value by the area of intersection between source and target file

&nbsp;&nbsp; for absolute values
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr
```

&nbsp; for relative values
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson --attr Relative --mode arealWeightingRelative -o output.geojson
```

###  2. Attribute Weighting
weights the attribute value by an additional attribute (e.g. population)

&nbsp; for absolute values
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --weight population --mode populationWeighting
```

&nbsp; for relative values
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_nonhierarchical.geojson --attr Relative --weight population --mode populationWeightingRelative -o output.geojson
```

###  3. Binary Dasymetric Weighting
additional control zones classified by binary values [0; 1] are used to mask out areas [0] where the attribute does not occur (e.g. uninhabited areas)

&nbsp; **Note: binary values have to be listed in an attribute called 'binary'**

&nbsp; for absolute values
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode binaryDasymetricWeighting --mask test/data/base_data/binarymask.geojson
```

&nbsp; for relative values
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Relative --mode binaryDasymetricWeightingRelative --mask test/data/base_data/binarymask.geojson
```

###  4. N-Class Dasymetric Weighting
additional control zones classified by n classes (e.g. land use) are used to weight the attribute value by its percentage values within the control zones

&nbsp; **Note: percentage values have to be listed in an attribute called 'prozent'**

&nbsp; for absolute values
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode nClassDasymetricWeighting --mask test/data/base_data/nclassmask.geojson
```

&nbsp; for relative values
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Relative --mode nClassDasymetricWeightingRelative --mask test/data/base_data/nclassmask.geojson
```

###  5. Linear Regression
a linear correlation between an independent variable (e.g. area size) and a dependent variable (the attribute value) is used to estimate the attribute value

&nbsp; for absolute values
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode linearRegression --mask test/data/base_data/nclassmask.geojson
```



## Options

You can specify these cli options:

* **--aggregate, -a** - Use aggregate mode
* **--disaggregate, -d** - Use disaggregate mode
* **--mode, -m** - Possible values: populationWeighting, populationWeightingRelative, binaryDasymetricWeighting, binaryDasymetricWeightingRealative, nClassDasymetricWeighting, nClassDasymetricWeightingRelative, linearRegression
* **--input, -i** - The path of the input geojson that will be used for aggregation/disaggregation
* **--target, -t** - The path of the target geojson
* **--output, -o** - The path of the output geojson
* **--attr** - The attribute that will be used
* **--weight** - The attribute from target geojson that is used for weighting
* **--verbose** - Maximum log level
* **--silent** - disable logging


## Tests

To run tests with mocha:
```
$ npm test
```

## Todos

* [ ] Linear Regression
* [ ] Linear Regression Relative

## Dependencies

* node.js 5.0 or higher
