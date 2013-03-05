var verifyNew = require('./util').verifyNew;
var RedirectResource = require('./redirectresource').RedirectResource;


function PermanentRedirectResource(relativeTargetUrl) {
    verifyNew(this, this.constructor.name);
    RedirectResource.call(this, RedirectResource.MOVED_PERMANENTLY, relativeTargetUrl);

    console.log("DEPRECATED: PermanentRedirectResource is deprecated in favor of " +
        "'new RedirectResource(RedirectResource.MOVED_PERMANENTLY, targetUrl)'");
}
PermanentRedirectResource.prototype = new RedirectResource();
PermanentRedirectResource.constructor = PermanentRedirectResource;


exports.PermanentRedirectResource = PermanentRedirectResource;
