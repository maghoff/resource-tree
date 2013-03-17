var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var Lookup = require('./lookup').Lookup;


var module = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));


// TODO: Should implement OPTIONS in this library
var defaultAllowedMethods = ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"];


function methodNotAllowed(res, resource, allowedMethods) {
    var allow = [];
    for (var member in resource) {
        if (member.substr(0, 5) === 'http_') {
            var method = member.substr(5);
            if (allowedMethods.indexOf(method) !== -1) {
                allow.push(method);
            }
        }
    }

    res.writeHead(405, {
        'Content-Type': 'text/plain',
        'Allow': allow.join(', ')
    });
    res.end("Method Not Allowed");
}

function dispatchToResource(req, res, resource, allowedMethods) {
    var functionObject = resource[functionName];

    allowedMethods = allowedMethods || defaultAllowedMethods;
    if (allowedMethods.indexOf(req.method) !== -1) {
        var functionName = 'http_' + req.method;
        functionObject = resource[functionName];
    } else {
        functionObject = undefined;
    }

    if (typeof functionObject === 'function') functionObject.call(resource, req, res);
    else methodNotAllowed(res, resource, allowedMethods);
}

function handleRequest(root, req, res, allowedMethods) {
    console.log('[req] ' + req.url);

    res.setHeader("Server", module.name + "/" + module.version);

    pathname = url.parse(req.url).pathname;
    Lookup.prototype.doLookup(root, pathname, function(resource) {
        if (resource === null) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found\n');
        } else {
            dispatchToResource(req, res, resource, allowedMethods);
        }
    });
}

function handleRequestFunction(root, allowedMethods) {
    return function (req, res) {
        handleRequest(root, req, res, allowedMethods);
    };
}

function createServer(root, allowedMethods) {
    return http.createServer(handleRequestFunction(root, allowedMethods));
}


exports.splitOneLevel = require('./util').splitOneLevel;

exports.Lookup = Lookup;
exports.MapLookup = require('./maplookup').MapLookup;
exports.FileLookup = require('./filelookup').FileLookup;
exports.DirectLookup = require('./directlookup').DirectLookup;
exports.OneLevelLookup = require('./onelevellookup').OneLevelLookup;
exports.SerialLookup = require('./seriallookup').SerialLookup;

exports.Resource = require('./resource').Resource;
exports.FileResource = require('./fileresource').FileResource;
exports.DirectoryResource = require('./directoryresource').DirectoryResource;
exports.RedirectResource = require('./redirectresource').RedirectResource;
exports.PermanentRedirectResource = require('./permanentredirectresource').PermanentRedirectResource;

exports.defaultAllowedMethods = defaultAllowedMethods;
exports.handleRequest = handleRequest;
exports.handleRequestFunction = handleRequestFunction;
exports.createServer = createServer;
