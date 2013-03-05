#!/usr/bin/env node

var resource_tree = require("./resource-tree");

// To enable naive directory listing:
var directoryResourceFactory = function (fullpath) { return new resource_tree.DirectoryResource(fullpath); };

resource_tree.createServer(new resource_tree.FileLookup(".", directoryResourceFactory)).listen(8080);

console.log("Now you can GET everything in the current directory under http://127.0.0.1:8080/\n");

console.log("For example:");
console.log("  * http://127.0.0.1:8080/");
console.log("  * http://127.0.0.1:8080/example-directory.js");
console.log("  * http://127.0.0.1:8080/README.md");
