#!/usr/bin/env node

var resource_tree = require('./resource-tree');
var http = require('http');
var path = require('path');

var root = {
    'example-fileresource.js': new resource_tree.FileResource(path.join(__dirname, 'example-fileresource.js'))
};

var server = http.createServer(function (req, res) {
    resource_tree.handleRequest(root, req, res);
});

/* The initialization of `server` can be shortened to either of the following:

var server = http.createServer(resource_tree.handleRequestFunction(root));

var server = resource_tree.createServer(root);

*/

server.listen(8080, "127.0.0.1");

console.log("Now you can GET http://127.0.0.1:8080/example-fileresource.js");
console.log("Everything else is properly handled as 404 (Not Found) or 405 (Method Not Allowed)");
