var util = require('./util');
var Lookup = require('./lookup').Lookup;


function OneLevelLookup(lookupFactory) {
    util.verifyNew(this, this.constructor.name);
    Lookup.call(this);

    this.lookup = function(reqpath, callback) {
        var split = util.splitOneLevel(reqpath);
        var nestedLookup = lookupFactory(split[0]);
        this.doLookup(nestedLookup, split[1], callback);
    };
}

OneLevelLookup.prototype = new Lookup();
OneLevelLookup.constructor = OneLevelLookup;


exports.OneLevelLookup = OneLevelLookup;
