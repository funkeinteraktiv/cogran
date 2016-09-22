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



Note: No String datatypes are allowed for attribute values (use Int or Real instead) <br>
Note: use only WGS84 as coordinate system


###&nbsp;  1. Simple Area Weighting
&nbsp; weights the attribute value by the area of intersection between source and target file

&nbsp;&nbsp;&nbsp; for absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr
```

&nbsp;&nbsp;&nbsp; for relative & average values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of all voters*, *32.000 € average income*, ...)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr kaufkraft --mode arealWeightingAdvanced
```

&nbsp;&nbsp;&nbsp; for relative values related to absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of 560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson --attr Relative --mode arealWeightingRelative -o output.geojson
```

###&nbsp;  2. Attribute Weighting
&nbsp; weights the attribute value by an additional attribute (e.g. population)

&nbsp;&nbsp;&nbsp; for absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --weight population --mode attributeWeighting
```

&nbsp;&nbsp;&nbsp; for relative & average values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of all voters*, *32.000 € average income*, ...)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr kaufkraft --weight population --mode attributeWeightingAdvanced
```

&nbsp;&nbsp;&nbsp; for relative values related to absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of 560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_nonhierarchical.geojson --attr Relative --weight population --mode attributeWeightingRelative -o output.geojson
```

###&nbsp;  3. Binary Dasymetric Weighting
&nbsp; additional control zones classified by binary values [0; 1] are used to mask out areas [0] where the attribute does not occur  
&nbsp; (e.g. uninhabited areas)

&nbsp; **Note: binary values have to be listed in an attribute called 'binary'**

&nbsp;&nbsp;&nbsp; for absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode binaryDasymetricWeighting --mask test/data/base_data/binarymask.geojson
```

&nbsp;&nbsp;&nbsp; for relative values related to absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of 560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Relative --mode binaryDasymetricWeightingRelative --mask test/data/base_data/binarymask.geojson
```

###&nbsp;  4. N-Class Dasymetric Weighting
&nbsp; additional control zones classified by n classes (e.g. land use) are used to weight the attribute value by its percentage values  
&nbsp; within the control zones

&nbsp; **Note: percentage values have to be listed in an attribute called 'prozent'**

&nbsp;&nbsp;&nbsp; for absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode nClassDasymetricWeighting --mask test/data/base_data/nclassmask.geojson
```

&nbsp;&nbsp;&nbsp; for relative values related to absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of 560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Relative --mode nClassDasymetricWeightingRelative --mask test/data/base_data/nclassmask.geojson
```

###&nbsp;  5. Linear Regression - in progress
&nbsp; a linear correlation between an independent variable (e.g. area size) and a dependent variable (the attribute value) is used to  
&nbsp; estimate the attribute value

&nbsp; **Note: additional classes have to be listed in an attribute called 'landuse'**

&nbsp;&nbsp;&nbsp; for absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode linearRegression --mask test/data/base_data/nclassmask.geojson
```



## Options

You can specify these cli options:

* **--disaggregate, -d** - Use (dis)aggregate mode
* **--mode, -m** - Possible values: arealWeightingAdvanced, arealWeightingRelative, attributeWeighting, attributeWeightingAdvanced, attributeWeightingRelative, binaryDasymetricWeighting, binaryDasymetricWeightingRealative, nClassDasymetricWeighting, nClassDasymetricWeightingRelative, linearRegression
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
