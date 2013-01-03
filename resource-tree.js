var http = require('http');
var url = require('url');
var path = require('path');
var assert = require('assert');
var fs = require('fs');


function splitOneLevel(full) {
    if (full.length !== 0) assert.equal(full.charAt(0), '/');
    var i = full.indexOf('/', 1);
    if (i === -1) {
        if (full === '/') {
            return ['/', ''];
        } else {
            return [full.slice(1), ''];
        }
    } else {
        return [full.slice(1, i), full.slice(i)];
    }
}


function MapLookup(map) {
    return {
        lookup: function(reqpath, callback) {
            var splitpath = splitOneLevel(reqpath);
            var dirname = splitpath[0], rest = splitpath[1];
            var lookup = map[dirname];
            if (typeof lookup === 'undefined') {
                callback(null);
            } else {
                lookup.lookup(rest, callback);
            }
        }
    };
}

function FileResource(fullpath) {
    var contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript'
    };

    return {
        http_GET: function(req, res) {
            var ext = path.extname(fullpath);
            var contentType = contentTypes[ext] || 'text/plain';

            res.writeHead(200, {'Content-Type': contentType});
            var f = fs.createReadStream(fullpath);
            f.pipe(res);
        }
    }
}

function FileLookup(root) {
    return {
        lookup: function(reqpath, callback) {
            var fullpath = path.join(root, reqpath);
            fs.exists(fullpath, function(exists) {
                if (exists) {
                    callback(FileResource(fullpath));
                } else {
                    callback(null);
                }
            });
        }
    };
}


function OneLevelLookup(lookupFactory) {
    return {
        lookup: function(reqpath, callback) {
            var split = splitOneLevel(reqpath);
            var nestedLookup = lookupFactory(split[0]);
            nestedLookup.lookup(split[1], callback);
        }
    };
}


function DirectLookup(resourceFactory) {
    return {
        lookup: function(reqpath, callback) {
            if (reqpath === '') {
                resourceFactory(callback);
            } else {
                callback(null);
            }
        }
    };
}


function methodNotAllowed(res, resource) {
    var allow = [];
    for (var member in resource) {
        if (member.substr(0, 5) === 'http_') {
            allow.push(member.substr(5));
        }
    }

    res.writeHead(405, {
        'Content-Type': 'text/plain',
        'Allow': allow.join(', ')
    });
    res.end("Method Not Allowed");
}


// TODO: Should implement OPTIONS in this library
// TODO: Should have dynamically configurable allowedMethods per server instance
var allowedMethods = ["GET", "HEAD", "PUT", "POST", "DELETE"];
function dispatchToResource(req, res, resource) {
    if (allowedMethods.indexOf(req.method) === -1) methodNotAllowed(res, resource);

    var functionName = 'http_' + req.method;
    var functionObject = resource[functionName];

    if (typeof functionObject === 'function') functionObject(req, res);
    else methodNotAllowed(res, resource);
}

function createServer(root) {
    return http.createServer(function (req, res) {
        console.log('[req] ' + req.url);

        pathname = url.parse(req.url).pathname;
        root.lookup(pathname, function(resource) {
            if (resource === null) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not found\n');
            } else {
                dispatchToResource(req, res, resource);
            }
        });
    });
}


exports.splitOneLevel = splitOneLevel;
exports.MapLookup = MapLookup;
exports.FileResource = FileResource;
exports.FileLookup = FileLookup;
exports.DirectLookup = DirectLookup;
exports.OneLevelLookup = OneLevelLookup;
exports.createServer = createServer;
