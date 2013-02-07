#!/usr/bin/env node

var resource_tree = require("./resource-tree");

resource_tree.createServer(new resource_tree.FileLookup(".")).listen(8080);

console.log("Now you can GET everything in the current directory under http://127.0.0.1:8080/\n");

console.log("For example:");
console.log("  * http://127.0.0.1:8080/example-directory.js");
console.log("  * http://127.0.0.1:8080/README.md");
