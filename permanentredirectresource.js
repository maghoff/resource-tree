var url = require('url');
var verifyNew = require('./util').verifyNew;
var Resource = require('./resource').Resource;


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

    this.http_GET = redirect;
    this.http_HEAD = redirect;
    this.http_POST = redirect;
    this.http_PUT = redirect;
    this.http_DELETE = redirect;
}

PermanentRedirectResource.prototype = new Resource();
PermanentRedirectResource.constructor = PermanentRedirectResource;


exports.PermanentRedirectResource = PermanentRedirectResource;
