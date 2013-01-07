#!/usr/bin/env node

var resource_tree = require('./resource-tree');
var path = require('path');
var fs = require('fs');
var highlight = require('highlight').Highlight; // npm install highlight


function HighlightResource(fullpath) {
    resource_tree.Resource.call(this);

    this.http_GET = function (req, res) {
        fs.readFile(fullpath, 'utf-8', function (err, data) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Internal Server Error");
                return;
            }

            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            var style = ".keyword{font-weight:bold} .string{color:green} .comment{color:grey}";
            res.write("<!DOCTYPE html>\n<html><head><title>" + fullpath + "</title><style>" + style + "</style></head><body><pre>");
            res.write(highlight(data));
            res.end("</pre></body></html>");
        });
    };
}

HighlightResource.prototype = new resource_tree.Resource();
HighlightResource.constructor = HighlightResource;


var root = {
    'example-custom-resource.js': new resource_tree.FileResource(path.join(__dirname, 'example-custom-resource.js')),
    'example-custom-resource.js.html': new HighlightResource(path.join(__dirname, 'example-custom-resource.js'))
};

resource_tree.createServer(root).listen(8080, "127.0.0.1");

console.log("Now you can GET http://127.0.0.1:8080/example-custom-resource.js and http://127.0.0.1:8080/example-custom-resource.js.html");
