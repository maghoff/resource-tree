resource-tree
=============

A useful separation of lookup and resources for implementing a HTTP server.

Small example:

    var resource_tree = require('resource-tree');

    var root = {
        // Assuming "example.js" exists in the same directory as this script
        'example.js': new resource_tree.FileResource(require('path').join(__dirname, 'example.js'))
    };

    resource_tree.createServer(root).listen(8080, "127.0.0.1");

    console.log("Now you can GET http://127.0.0.1:8080/example.js");
    console.log("Everything else is properly handled as 404 (Not Found) or 405 (Method Not Allowed)");

See [example-fileresource.js][1] and [example-custom-resource.js][2] for slightly more.

[1]: https://bitbucket.org/maghoff/resource-tree/src/tip/example-fileresource.js
[2]: https://bitbucket.org/maghoff/resource-tree/src/tip/example-custom-resource.js
