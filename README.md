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

**Aggregation**

```
$ cogran --input test-data/wahl/wahl.shp --target test-data/mieten/mieten.shp --attr "BRFW" --output test-data/output.zip
```

### Todos

[ ] Add better logging
[ ] Add disaggregation function
[ ] Add tests

### Dependencies

* node.js 5.0 or higher