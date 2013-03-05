/*

Use SerialLookup to merge different lookups onto a single root.

It works by performing the lookup on a sequence of lookup-ish objects,
and executing the callback for the first lookup that finds a resource.

*/

var verifyNew = require('./util').verifyNew;
var Lookup = require('./lookup').Lookup;


function SerialLookup(nestedLookups) {
    verifyNew(this, this.constructor.name);
	Lookup.call(this);

	this.nestedLookups = nestedLookups;
}
SerialLookup.prototype = new Lookup();
SerialLookup.constructor = SerialLookup;

SerialLookup.prototype.lookup = function(reqpath, callback) {
	var self = this;

	function oneLookup(i) {
		if (i >= self.nestedLookups.length) {
			callback(null);
			return;
		}

		var currentLookup = self.nestedLookups[i];
		self.doLookup(currentLookup, reqpath, function (resource) {
			if (resource) callback(resource);
			else oneLookup(i + 1);
		});
	}

	oneLookup(0);
};


exports.SerialLookup = SerialLookup;
