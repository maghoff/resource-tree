resource-tree
=============

A useful separation of lookup (URL parsing/routing) and resources for implementing a HTTP server.

Installation: `npm install resource-tree`

Small example:

    var resource_tree = require('resource-tree');

    var root = {
        // Assuming "example.js" exists in the same directory as this script
        'example.js': new resource_tree.FileResource(require('path').join(__dirname, 'example.js'))
    };

    resource_tree.createServer(root).listen(8080, "127.0.0.1");

    console.log("Now you can GET http://127.0.0.1:8080/example.js");
    console.log("Everything else is properly handled as 404 (Not Found) or 405 (Method Not Allowed)");

Examples by use-case:

 * I want to read a simple example: [example-fileresource.js][1]
 * I want to serve a file directly from disk: [example-fileresource.js][1]
 * I want to serve a directory directly from disk: [example-directory.js][4]
 * I want to create a simple custom resource: [example-custom-resource.js][2]
 * I want to implement CRUD: [example-crud.js][3]

[1]: https://bitbucket.org/maghoff/resource-tree/src/tip/example-fileresource.js
[2]: https://bitbucket.org/maghoff/resource-tree/src/tip/example-custom-resource.js
[3]: https://bitbucket.org/maghoff/resource-tree/src/tip/example-crud.js
[4]: https://bitbucket.org/maghoff/resource-tree/src/tip/example-directory.js
