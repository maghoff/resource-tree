var verifyNew = require('./util').verifyNew;


function Resource() {
    verifyNew(this, this.constructor.name);
}


exports.Resource = Resource;
