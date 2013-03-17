var path = require('path');
var fs = require('fs');
var verifyNew = require('./util').verifyNew;
var Resource = require('./resource').Resource;


function FileResource(fullpath) {
    verifyNew(this, this.constructor.name);
    Resource.call(this);

    var contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.svg': 'image/svg+xml'
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


exports.FileResource = FileResource;
