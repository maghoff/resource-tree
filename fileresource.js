var path = require('path');
var fs = require('fs');
var verifyNew = require('./util').verifyNew;
var Resource = require('./resource').Resource;


function FileResource(fullpath, headers) {
    verifyNew(this, this.constructor.name);
    Resource.call(this);

    var contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.svg': 'image/svg+xml'
    };

    this.fullpath = fullpath;
    this.headers = {};
    for (var header in headers) {
        if (!headers.hasOwnProperty(header)) continue;
        this.headers[header.toLowerCase()] = headers[header];
    }

    var ext = path.extname(this.fullpath);
    this.headers['content-type'] = this.headers['content-type'] || contentTypes[ext] || 'text/plain';
}
FileResource.prototype = new Resource();
FileResource.constructor = FileResource;

FileResource.prototype.http_GET = function(req, res) {
    fs.stat(this.fullpath, function (err, stats) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Server Error");
            return;
        }

        res.setHeader("content-length", stats.size);
        res.writeHead(200, this.headers);
        var f = fs.createReadStream(this.fullpath);
        f.pipe(res);
    }.bind(this));
}


exports.FileResource = FileResource;
