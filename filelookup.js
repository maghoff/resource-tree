var path = require('path');
var fs = require('fs');
var verifyNew = require('./util').verifyNew;
var Lookup = require('./lookup').Lookup;
var DirectoryResource = require('./directoryresource').DirectoryResource;
var FileResource = require('./fileresource').FileResource;
var redirect = require('./redirectresource');


function FileLookup(root, directoryResourceFactory, fileResourceFactory) {
    verifyNew(this, this.constructor.name);
    Lookup.call(this);

    directoryResourceFactory = directoryResourceFactory || function (fullpath) { return null; };
    fileResourceFactory = fileResourceFactory || function (fullpath) { return new FileResource(fullpath); };

    this.lookup = function(reqpath, callback) {
        if (reqpath.split('/').indexOf('..') !== -1) {
            callback(null);
            return;
        }

        var fullpath = path.join(root, reqpath);

        fs.exists(fullpath, function(exists) {
            if (exists) {
                fs.stat(fullpath, function(err, stats) {
                    if (stats.isDirectory()) {
                        if (reqpath.slice(-1) === '/') {
                            callback(directoryResourceFactory(fullpath));
                        } else {
                            var targetUrl = reqpath.slice(reqpath.lastIndexOf('/') + 1) + '/';
                            callback(new redirect.RedirectResource(redirect.TEMPORARY_REDIRECT, targetUrl));
                        }
                    } else {
                        callback(fileResourceFactory(fullpath));
                    }
                });
            } else {
                callback(null);
            }
        });
    };
}

FileLookup.prototype = new Lookup();
FileLookup.constructor = FileLookup;


exports.FileLookup = FileLookup;
