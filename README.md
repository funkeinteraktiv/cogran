# cogran.js

CoGran - A command line tool for COmbining data of different spatial GRANularity  
  
**Note: Project is still under development.**

  
  
## Installation

To install cogran.js you need to clone the repository first.

```
$ git clone https://github.com/berlinermorgenpost/cogran.git
```

Now you have to install all dependencies for the application. You need node.js 5.0 or higher.

```
$ cd /path/to/cogran
$ npm install
```

Using the link command, we install cogran globally, so that you can run it from every folder:

```
$ npm link
```

## Usage Examples


**Note: use only WGS84 as coordinate system**


###&nbsp;  1. Simple Area Weighting
&nbsp; weights the attribute value by the area of intersection between source and target file <br> <br>
![SimpleAreaWeighting](http://i.imgur.com/aZevDoT.png)

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
&nbsp;&nbsp;&nbsp; (e.g. *20 % of 560 voters*)<br>
&nbsp;&nbsp;&nbsp; **Note: (dis)aggregating attribute has to be listed in an attribute called 'Aggr'**
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson --attr RelativeValue --mode arealWeightingRelative -o output.geojson
```

###&nbsp;  2. Attribute Weighting
&nbsp; weights the attribute value by an additional attribute of the target file (e.g. population) <br>
&nbsp; ![AttributeWeighting](http://i.imgur.com/v4xjVJG.png)

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
&nbsp;&nbsp;&nbsp; (e.g. *20 % of 560 voters*) <br>
&nbsp;&nbsp;&nbsp; **Note: (dis)aggregating attribute has to be listed in an attribute called 'Aggr'**
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_nonhierarchical.geojson --attr RelativeValue --weight population --mode attributeWeightingRelative -o output.geojson
```

###&nbsp;  3. Binary Dasymetric Weighting
&nbsp; additional control zones classified by binary values [0; 1] are used to mask out areas [0] where the attribute does not occur  
&nbsp; (e.g. uninhabited areas)<br>
&nbsp; ![BinaryDasymetricWeighting](http://i.imgur.com/JWXB7Pf.png)

&nbsp; **Note: binary values have to be listed in an attribute called 'binary'**

&nbsp;&nbsp;&nbsp; for absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode binaryDasymetricWeighting --mask test/data/base_data/binarymask.geojson
```

&nbsp;&nbsp;&nbsp; for relative values related to absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of 560 voters*) <br>
&nbsp;&nbsp;&nbsp; **Note: (dis)aggregating attribute has to be listed in an attribute called 'Aggr'**
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr RelativeValue --mode binaryDasymetricWeightingRelative --mask test/data/base_data/binarymask.geojson
```

###&nbsp;  4. N-Class Dasymetric Weighting
&nbsp; additional control zones classified by n classes (e.g. land use) are used to weight the attribute value by its percentage values  
&nbsp; within the control zones<br>
&nbsp; ![NClassDasymetricWeighting](http://i.imgur.com/nVlN8a9.png)

&nbsp; **Note: percentage values have to be listed in an attribute called 'prozent'**

&nbsp;&nbsp;&nbsp; for absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*) <br>
&nbsp;&nbsp;&nbsp; **Note: (dis)aggregating attribute has to be listed in an attribute called 'Aggr'**
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode nClassDasymetricWeighting --mask test/data/base_data/nclassmask.geojson
```

&nbsp;&nbsp;&nbsp; for relative values related to absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of 560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Relative --mode nClassDasymetricWeightingRelative --mask test/data/base_data/nclassmask.geojson
```

###&nbsp;  5. Linear Regression
&nbsp; a linear correlation between an independent variable (e.g. area size) and a dependent variable (the attribute value) is used to  
&nbsp; estimate the attribute value<br>
&nbsp; ![LinearRegression](http://i.imgur.com/5nytPLB.png)

&nbsp; **Note: additional classes have to be listed in an attribute called 'landuse'**<br>
&nbsp; ...and please note that negative attribute values may result due to missing endpoints of linear regression line<br>

&nbsp;&nbsp;&nbsp; for absolute values: <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
$ cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode linearRegression --mask test/data/base_data/nclassmask.geojson
```



## Options

You can specify these cli options (you can also see the options if you run CoGran:

```
$ cogran
```

* **--disaggregate, -d** - Use (dis)aggregate mode
* **--input, -i** - path and name of the input geojson that will be used for aggregation/disaggregation
* **--target, -t** - path and name of the target geojson
* **--output, -o** - path and name of the output geojson
* **--attr** - The attribute that will be used
* **--mode, -m** - Possible values: arealWeightingAdvanced, arealWeightingRelative, attributeWeighting, attributeWeightingAdvanced, attributeWeightingRelative, binaryDasymetricWeighting, binaryDasymetricWeightingRelative, nClassDasymetricWeighting, nClassDasymetricWeightingRelative, linearRegression
* **--mask** - path and name of the geojson with ancillary information
* **--weight** - The attribute from target geojson that is used for weighting

* **--verbose** - Maximum log level
* **--silent** - disable logging

## Tests

To run tests with mocha:
```
$ npm test
```

## Todos

* [ ] 

