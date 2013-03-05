var util = require('./util');
var Lookup = require('./lookup').Lookup;


function MapLookup(map) {
    util.verifyNew(this, this.constructor.name);
    Lookup.call(this);

    this.lookup = function(reqpath, callback) {
        var splitpath = util.splitOneLevel(reqpath);
        var dirname = splitpath[0], rest = splitpath[1];
        var lookup = map[dirname];
        this.doLookup(lookup, rest, callback);
    };
}

MapLookup.prototype = new Lookup();
MapLookup.constructor = MapLookup;


exports.MapLookup = MapLookup;
