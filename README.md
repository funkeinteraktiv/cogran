# cogran.js

CoGran - A command line tool for **co**mbining data of different spatial **gran**ularity  

**Note: Project is still under development.**



## Installation

To install cogran.js you need to clone the repository first.

```
git clone https://github.com/berlinermorgenpost/cogran.git
```

Now you have to install all dependencies for the application. You need node.js 5.0 or higher.

```
cd /path/to/cogran
npm install
```

Using the link command, we install cogran globally, so that you can run it from every folder:

```
npm link
```

## Usage Examples


**Note: Only use GeoJSON files with WGS84 (EPSG: 4326) as coordinate system**


###&nbsp;  1. Simple Area Weighting
&nbsp; weights the attribute value by the area of intersection between source and target file <br> <br>
![SimpleAreaWeighting](http://i.imgur.com/aZevDoT.png)

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr
```

&nbsp;&nbsp;&nbsp; **for relative & average values:** <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of all voters*, *32.000 € average income*, ...)
```
cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr income --mode arealWeightingRelative
```

###&nbsp;  2. Attribute Weighting
&nbsp; weights the attribute value by an additional attribute of the target file (e.g. population) <br>
&nbsp; ![AttributeWeighting](http://i.imgur.com/v4xjVJG.png)

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --weight population --mode attributeWeighting
```

&nbsp;&nbsp;&nbsp; for **relative & average values:** <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of all voters*, *32.000 € average income*, ...)
```
cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr income --weight population --mode attributeWeightingRelative
```

###&nbsp;  3. Binary Dasymetric Weighting
&nbsp; additional control zones are used to mask out areas. Polygons (e.g. inhabited areas) get binary value [1]<br>
&nbsp; ![BinaryDasymetricWeighting](http://i.imgur.com/JWXB7Pf.png)

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode binaryDasymetricWeighting --mask test/data/base_data/binarymask.geojson
```

&nbsp;&nbsp;&nbsp; **for relative & average values:** <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of all voters*, *32.000 € average income*, ...)
```
cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode binaryDasymetricWeightingRelative --mask test/data/base_data/binarymask.geojson
```

###&nbsp;  4. N-Class Dasymetric Weighting
&nbsp; additional control zones with percentage values of an attribute (e.g. population share) are used to weight the input attribute<br>
&nbsp; ![NClassDasymetricWeighting](http://i.imgur.com/nVlN8a9.png)

&nbsp; **Note: percentage values have to be listed in an attribute called 'percentage'**

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*) <br>
```
cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode nClassDasymetricWeighting --mask test/data/base_data/nclassmask.geojson
```

&nbsp;&nbsp;&nbsp; **for relative & average values:** <br>
&nbsp;&nbsp;&nbsp; (e.g. *20 % of all voters*, *32.000 € average income*, ...)
```
cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode nClassDasymetricWeightingRelative --mask test/data/base_data/nclassmask.geojson
```

###&nbsp;  5. Linear Regression
&nbsp; a linear correlation between an independent variable (e.g. area size) and a dependent variable (the attribute value) is used to estimate the attribute value<br>
&nbsp; ![LinearRegression](http://i.imgur.com/5nytPLB.png)

&nbsp; **Note: additional classes have to be listed in an attribute called 'landuse'**<br>
&nbsp; ...and please note that negative attribute values may result due to missing endpoints of linear regression line<br>

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
&nbsp;&nbsp;&nbsp; (e.g. *560 voters*)
```
cogran -d -i test/data/base_data/sourcefeatures.geojson -t test/data/base_data/targetfeatures_hierarchical.geojson -o output.geojson --attr Aggr --mode linearRegression --mask test/data/base_data/nclassmask.geojson
```

## Options

You can specify these options (you can also see the options if you run CoGran):

```
cogran
```

* **--disaggregate, -d** - Use (dis)aggregate mode
* **--input, -i** - path and name of the input geojson that will be used for aggregation/disaggregation
* **--target, -t** - path and name of the target geojson
* **--output, -o** - path and name of the output geojson
* **--attr** - The attribute that will be used
* **--mode, -m** - Possible values: arealWeightingRelative, attributeWeighting, attributeWeightingRelative, binaryDasymetricWeighting, binaryDasymetricWeightingRelative, nClassDasymetricWeighting, nClassDasymetricWeightingRelative, linearRegression
* **--mask** - path and name of the geojson with ancillary information
* **--weight** - The attribute from target geojson that is used for weighting

## Todos

* decrease runtime for calculations

## Credits

* HCU HafenCity Universität Hamburg, Berliner Morgenpost. Unterstützt von der Volkswagen-Stiftung
