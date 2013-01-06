var http = require('http');
var url = require('url');
var path = require('path');
var assert = require('assert');
var fs = require('fs');


function verifyNew(that, fname) {
    if (this === that) throw "Missing new on invocation of constructor " + fname;
}


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


function Resource() {
    verifyNew(this, this.constructor.name);
}


function MapLookup(map) {
    verifyNew(this, this.constructor.name);
    Lookup.call(this);

    this.lookup = function(reqpath, callback) {
        var splitpath = splitOneLevel(reqpath);
        var dirname = splitpath[0], rest = splitpath[1];
        var lookup = map[dirname];
        this.doLookup(lookup, rest, callback);
    };
}

MapLookup.prototype = new Lookup();
MapLookup.constructor = MapLookup;


function FileResource(fullpath) {
    verifyNew(this, this.constructor.name);
    Resource.call(this);

    var contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript'
    };

    this.http_GET = function(req, res) {
        var ext = path.extname(fullpath);
        var contentType = contentTypes[ext] || 'text/plain';

        res.writeHead(200, {'Content-Type': contentType});
        var f = fs.createReadStream(fullpath);
        f.pipe(res);
    };
}

FileResource.prototype = new Resource();
FileResource.constructor = FileResource;


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


function OneLevelLookup(lookupFactory) {
    verifyNew(this, this.constructor.name);
    Lookup.call(this);

    this.lookup = function(reqpath, callback) {
        var split = splitOneLevel(reqpath);
        var nestedLookup = lookupFactory(split[0]);
        this.doLookup(nestedLookup, split[1], callback);
    };
}

OneLevelLookup.prototype = new Lookup();
OneLevelLookup.constructor = OneLevelLookup;


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


function PermanentRedirectResource(relativeTargetUrl) {
    verifyNew(this, this.constructor.name);
    Resource.call(this);

    function redirect(req, res) {
        var parsedUrl = url.parse(req.url);
        var targetPath = url.resolve(parsedUrl.path, relativeTargetUrl);
        parsedUrl.pathname = targetPath;
        var targetUrl = url.format(parsedUrl);

        res.writeHead(301, {
            "Location": targetUrl,
            "Content-Type": "text/plain"
        });

        if (req.method !== 'HEAD') {
            res.write("Go see " + targetUrl);
        }
        res.end();
    }

    return {
        http_GET: redirect,
        http_HEAD: redirect,
        http_POST: redirect,
        http_PUT: redirect,
        http_DELETE: redirect
    };
}

PermanentRedirectResource.prototype = new Resource();
PermanentRedirectResource.constructor = PermanentRedirectResource;


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

        res.setHeader("Server", "resource-tree/0.0.0");

        pathname = url.parse(req.url).pathname;
        Lookup.prototype.doLookup(root, pathname, function(resource) {
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
exports.Lookup = Lookup;
exports.Resource = Resource;
exports.MapLookup = MapLookup;
exports.FileResource = FileResource;
exports.FileLookup = FileLookup;
exports.DirectLookup = DirectLookup;
exports.OneLevelLookup = OneLevelLookup;
exports.PermanentRedirectResource = PermanentRedirectResource;
exports.createServer = createServer;
