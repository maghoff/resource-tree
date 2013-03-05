// Preserve order here to resolve circular dependency with MapLookup:
exports.Lookup = Lookup;

var verifyNew = require('./util').verifyNew;
var Resource = require('./resource').Resource;
var MapLookup = require('./maplookup').MapLookup;


function Lookup() {
    verifyNew(this, this.constructor.name);
}

Lookup.prototype.doLookup = function (lookupish, path, callback) {
    if (lookupish === undefined) {
        callback(null);
    } else if (lookupish instanceof Lookup) {
        lookupish.lookup(path, callback);
    } else if (lookupish instanceof Resource) {
        var resource = lookupish;
        callback(resource);
    } else if (typeof lookupish === 'function') {
        var resourceFactory = lookupish;
        resourceFactory(callback);
    } else if (typeof lookupish === 'object') {
        var lookup = new MapLookup(lookupish);
        lookup.lookup(path, callback);
    } else {
        throw "Not a lookup or lookup-like object";
    }
}
