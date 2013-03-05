var assert = require('assert');


function verifyNew(that, fname) {
    if (this === that) throw "Missing new on invocation of constructor " + fname;
}

function splitOneLevel(full) {
    if (full.length !== 0) assert.equal(full.charAt(0), '/');
    var i = full.indexOf('/', 1);
    if (i === -1) {
        if (full === '/') {
            return ['/', ''];
        } else {
            return [full.slice(1), ''];
        }
    } else {
        return [full.slice(1, i), full.slice(i)];
    }
}


exports.verifyNew = verifyNew;
exports.splitOneLevel = splitOneLevel;
