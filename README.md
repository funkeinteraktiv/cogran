# cogran.js

CoGran - A command line tool for **co**mbining data of different spatial **gran**ularity

CoGran allows a spatial re-organization of geodata containing quantitative (statistical) information due to the fact that this is often not given in identical spatial units (like postal code districts, wards, or urban districts). Based on five different methods correlations between e.g. election results and income can be visualized. Recommendations for choosing the most suitable method for your data sets will follow.
![CoGran](http://i.imgur.com/PY9bfpI.png)

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

**For Windows Users: use *node index.js* instead of *cogran* as a prefix**

**Note: Only use GeoJSON files with WGS84 (EPSG: 4326) as coordinate system**


#### 1. Simple Area Weighting  
&nbsp; weights the attribute value by the area of intersection between source and target file <br> <br>
![SimpleAreaWeighting](http://i.imgur.com/aZevDoT.png)

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
```
cogran -d -i path/input.geojson -t path/target.geojson -o path/output.geojson --attr attributeName
```
&nbsp;&nbsp;&nbsp;  Example:
```
cogran -d -i testdata/berlin/kriminalitaet_bezirksregionen.geojson -t testdata/berlin/447_lor_planungsraeume.geojson -o testdata/berlin/arealWeighting_kriminalitaet_bezirksregionenToPlanungsraeume.geojson --attr Alle_2012
```

&nbsp;&nbsp;&nbsp; **for relative & average values:** <br>
```
cogran -d -i path/input.geojson -t path/target.geojson -o path/output.geojson --attr attributeName --mode arealWeightingRelative
```
&nbsp;&nbsp;&nbsp;  Example:
```
cogran -d -i testdata/hamburg/wohnflaecheProEW_Stadtteile.geojson -t testdata/hamburg/7_bezirke.geojson -o testdata/hamburg/arealWeightingRelative_wohnflaeche_stadtteileToBezirke.geojson --attr WFl_m2 --mode arealWeightingRelative
```

###&nbsp;  2. Attribute Weighting  
&nbsp; weights the attribute value by an additional attribute of the target file (e.g. population) <br>
&nbsp; ![AttributeWeighting](http://i.imgur.com/v4xjVJG.png)

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
```
cogran -d -i path/input.geojson -t path/target.geojson -o path/output.geojson --attr attributeName --weight weightingAttribute --mode attributeWeighting
```
&nbsp;&nbsp;&nbsp;  Example:
```
cogran -d -i testdata/berlin/kriminalitaet_bezirksregionen.geojson -t testdata/Berlin/zugezogene_planungsraeume.geojson -o testdata/berlin/attributeWeighting_kriminalitaet_bezirksregionenToPlanungsraeume.geojson --attr Alle_2012 --weight Einwohner --mode attributeWeighting
```

&nbsp;&nbsp;&nbsp; **for relative & average values:** <br>
```
cogran -d -i path/input.geojson -t path/target.geojson -o path/output.geojson --attr attributeName --weight weightingAttribute --mode attributeWeightingRelative
```
&nbsp;&nbsp;&nbsp;  Example:
```
cogran -d -i testdata/hamburg/wohnflaecheProEW_Stadtteile.geojson -t testdata/hamburg/einwohner_bezirke.geojson -o testdata/hamburg/attributeWeightingRelative_wohnflaeche_stadtteileToBezirke.geojson --attr WFl_m2 --weight Insgesamt --mode attributeWeightingRelative
```

###&nbsp;  3. Binary Dasymetric Weighting  
&nbsp; additional control zones are used to mask out areas. Polygons (e.g. inhabited areas) get binary value [1]<br>
&nbsp; ![BinaryDasymetricWeighting](http://i.imgur.com/JWXB7Pf.png)

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
```
cogran -d -i path/input.geojson -t path/target.geojson -o path/output.geojson --attr attributeName --mask path/binarymask.geojson --mode binaryDasymetricWeighting
```
&nbsp;&nbsp;&nbsp;  Example:
```
cogran -d -i testdata/berlin/kriminalitaet_bezirksregionen.geojson -t testdata/berlin/447_lor_planungsraeume.geojson -o testdata/berlin/binaryDasymetricWeighting_kriminalitaet_bezirksregionenToPlanungsraeume.geojson --attr Alle_2012 --mask testdata/berlin/wohnbloecke.geojson --mode binaryDasymetricWeighting
```

&nbsp;&nbsp;&nbsp; **for relative & average values:** <br>
```
cogran -d -i path/input.geojson -t path/target.geojson -o path/output.geojson --attr attributeName --mask path/binarymask.geojson --mode binaryDasymetricWeightingRelative
```
&nbsp;&nbsp;&nbsp;  Example:
```
cogran -d -i testdata/hamburg/wohnflaecheProEW_Stadtteile.geojson -t testdata/hamburg/7_bezirke.geojson -o testdata/hamburg/binaryDasymetricWeightingRelative_wohnflaeche_stadtteileToBezirke.geojson --attr WFl_m2 --mask testdata/hamburg/bebauteFlaeche.geojson --mode binaryDasymetricWeightingRelative
```

###&nbsp;  4. N-Class Dasymetric Weighting  
&nbsp; additional control zones with percentage values of an attribute (e.g. share of the population) are used to weight the input attribute<br>
&nbsp; ![NClassDasymetricWeighting](http://i.imgur.com/MEgaFuX.png)

&nbsp; **Note: percentage values have to be listed in an attribute called 'percentage'**

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
```
cogran -d -i path/input.geojson -t path/target.geojson -o path/output.geojson --attr attributeName --mask path/nclassmask.geojson --mode nClassDasymetricWeighting
```
&nbsp;&nbsp;&nbsp;  Example:
```
cogran -d -i testdata/berlin/kriminalitaet_bezirksregionen.geojson -t testdata/berlin/447_lor_planungsraeume.geojson -o testdata/berlin/nClassDasymetricWeighting_kriminalitaet_bezirksregionenToPlanungsraeume.geojson --attr Alle_2012 --mask testdata/berlin/wohnbloecke.geojson --mode nClassDasymetricWeighting
```

&nbsp;&nbsp;&nbsp; **for relative & average values:** <br>
```
cogran -d -i path/input.geojson -t path/target.geojson -o path/output.geojson --attr attributeName --mask path/nclassmask.geojson --mode nClassDasymetricWeightingRelative
```
&nbsp;&nbsp;&nbsp;  Example:
```
cogran -d -i testdata/hamburg/wohnflaecheProEW_Stadtteile.geojson -t testdata/hamburg/7_bezirke.geojson -o testdata/hamburg/nClassDasymetricWeightingRelative_wohnflaeche_stadtteileToBezirke.geojson --attr WFl_m2 --mask testdata/hamburg/einwohner_statistischeGebiete.geojson --mode nClassDasymetricWeightingRelative
```

###&nbsp;  5. Linear Regression
&nbsp; a linear correlation between an independent variable (e.g. area size) and a dependent variable (the attribute value) is used to estimate the attribute value<br>
&nbsp; ![LinearRegression](http://i.imgur.com/eeE66BU.png)

&nbsp; **Note: additional classes have to be listed in an attribute called 'class'**<br>
&nbsp; ...and please note that negative attribute values may result due to missing endpoints of linear regression line<br>

&nbsp;&nbsp;&nbsp; **for absolute values:** <br>
```
cogran -d -i path/input.geojson -t path/target.geojson -o path/output.geojson --attr attributeName --mask path/nclassmask.geojson --mode linearRegression
```
&nbsp;&nbsp;&nbsp;  Example:
```
cogran -d -i testdata/berlin/kriminalitaet_bezirksregionen.geojson -t testdata/berlin/447_lor_planungsraeume.geojson -o testdata/berlin/linearRegression_kriminalitaet_bezirksregionenToPlanungsraeume.geojson --attr Alle_2012 --mask testdata/berlin/wohnbloecke.geojson --mode linearRegression
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
* **--attr** - The attribute that will be used (if you wish to reorganize several attributes at once use *--attr "attributeName1; attributeName2"*)
* **--mode, -m** - Possible values: arealWeightingRelative, attributeWeighting, attributeWeightingRelative, binaryDasymetricWeighting, binaryDasymetricWeightingRelative, nClassDasymetricWeighting, nClassDasymetricWeightingRelative, linearRegression
* **--mask** - path and name of the geojson with ancillary information
* **--weight** - The attribute from target geojson that is used for weighting

## Todos

* decrease runtime for calculations
* add recommendation
* add link to CoGran-Paper
* complete GUI

## Credits

* HCU HafenCity Universität Hamburg, Berliner Morgenpost. Unterstützt von der Volkswagen-Stiftung
