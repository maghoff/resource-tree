var fs = require('fs');
var verifyNew = require('./util').verifyNew;
var Resource = require('./resource').Resource;


function DirectoryResource(fullpath) {
    verifyNew(this, this.constructor.name);
	Resource.call(this);

	this.http_GET = function(req, res) {
		if (req.url.slice(-1) !== '/') {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end("DirectoryResource served from URL without trailing /");
			return;
		}

		fs.readdir(fullpath, function(err, files) {
			if (err) {
				res.writeHead(500, {'Content-Type': 'text/plain'});
				res.end('Failed to list directory.');
			} else {
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write('<!DOCTYPE html>\n<html><body><ul>');
				files.forEach(function (relpath, index) {
					res.write('<li><a href="'+relpath+'">'+relpath+'</a></li>');
				});
				res.end('</ul></body></html>');
			}
		});
	};
}


exports.DirectoryResource = DirectoryResource;
