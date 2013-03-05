var verifyNew = require('./util').verifyNew;
var redirect = require('./redirectresource');


function PermanentRedirectResource(relativeTargetUrl) {
    verifyNew(this, this.constructor.name);
    redirect.RedirectResource.call(this, redirect.RedirectResource.MOVED_PERMANENTLY, relativeTargetUrl);

    console.log("DEPRECATED: PermanentRedirectResource is deprecated in favor of " +
        "'new RedirectResource(RedirectResource.MOVED_PERMANENTLY, targetUrl)'");
}
PermanentRedirectResource.prototype = new redirect.RedirectResource();
PermanentRedirectResource.constructor = PermanentRedirectResource;


exports.PermanentRedirectResource = PermanentRedirectResource;
