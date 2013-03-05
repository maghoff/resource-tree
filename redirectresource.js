var url = require('url');
var verifyNew = require('./util').verifyNew;
var Resource = require('./resource').Resource;


function RedirectResource(redirectType, relativeTargetUrl) {
    verifyNew(this, this.constructor.name);
    Resource.call(this);

    function redirect(req, res) {
        var parsedUrl = url.parse(req.url);
        var targetPath = url.resolve(parsedUrl.path, relativeTargetUrl);
        parsedUrl.pathname = targetPath;
        var targetUrl = url.format(parsedUrl);

        res.writeHead(redirectType, {
            "Location": targetUrl,
            "Content-Type": "text/html"
        });

        if (req.method !== 'HEAD') {
            res.write('<!DOCTYPE html>\n');
            res.write('<a href="' + targetUrl + '">Go see ' + targetUrl + '</a>');
        }
        res.end();
    }

    this.http_GET = redirect;
    this.http_HEAD = redirect;
    this.http_POST = redirect;
    this.http_PUT = redirect;
    this.http_DELETE = redirect;
}

RedirectResource.prototype = new Resource();
RedirectResource.constructor = RedirectResource;


exports.RedirectResource = RedirectResource;
exports.MOVED_PERMANENTLY = 301; // Always go here instead of where you were
exports.FOUND = 302; // Obsolete. Prefer TEMPORARY_REDIRECT or SEE_OTHER
exports.SEE_OTHER = 303; // Go here *and* switch to GET
exports.TEMPORARY_REDIRECT = 307; // Go here and make the *same* request
