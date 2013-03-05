var path = require('path');
var fs = require('fs');
var verifyNew = require('./util').verifyNew;
var Lookup = require('./lookup').Lookup;
var FileResource = require('./fileresource').FileResource;


function FileLookup(root) {
    verifyNew(this, this.constructor.name);
    Lookup.call(this);

    this.lookup = function(reqpath, callback) {
        var fullpath = path.join(root, reqpath);
        fs.exists(fullpath, function(exists) {
            if (exists) {
                callback(new FileResource(fullpath));
            } else {
                callback(null);
            }
        });
    };
}

FileLookup.prototype = new Lookup();
FileLookup.constructor = FileLookup;


exports.FileLookup = FileLookup;
