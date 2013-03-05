var verifyNew = require('./util').verifyNew;
var Lookup = require('./lookup').Lookup;


function DirectLookup(resourceFactory) {
    verifyNew(this, this.constructor.name);
    Lookup.call(this);

    this.lookup = function(reqpath, callback) {
        if (reqpath === '') {
            resourceFactory(callback);
        } else {
            callback(null);
        }
    };
}

DirectLookup.prototype = new Lookup();
DirectLookup.constructor = DirectLookup;


exports.DirectLookup = DirectLookup;
