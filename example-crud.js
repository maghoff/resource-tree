#!/usr/bin/env node

var resource_tree = require('./resource-tree');


var db = [
	{
		"name": "test.txt",
		"Content-Type": "text/plain",
		"body": "Test content"
	}
];


function ListResource(dataRoot) {
	resource_tree.Resource.call(this);

	this.dataRoot = dataRoot;
}

ListResource.prototype = new resource_tree.Resource();
ListResource.constructor = ListResource;

ListResource.prototype.http_GET = function (req, res) {
	res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});

	res.write("<!DOCTYPE html>");
	res.write("<html>");
	res.write("<head>");
	res.write("<title>CRUD</title>");
	res.write("<script>");
	res.write("function xhr(method, url) { var x = new XMLHttpRequest(); x.open(method,url,true); x.send(); }\n");
	res.write("function del(d) { xhr('DELETE', d); }\n");
	res.write("</script>");
	res.write("</head>");
	res.write("<body><ul>");
	console.log(this);
	for (var d in db) {
		var url = this.dataRoot + d;
		res.write('<li><a href="' + url + '">' + db[d].name + '</a> <div class="put"></div> <a href="javascript:del(\'' + url + '\')">[del]</a></li>');
	}
	res.write("</ul>");
	res.write("</body>");
	res.end("</html>");
};


function DataResource(id) {
	resource_tree.Resource.call(this);

	this.http_GET = function (req, res) {
		var data = db[id];
		res.writeHead(200, {"Content-Type": data["Content-Type"]});
		res.end(data.body);
	};

	this.http_DELETE = function (req, res) {
		delete db[id];
		res.writeHead(204);
		res.end();
	};
}

DataResource.prototype = new resource_tree.Resource();
DataResource.constructor = DataResource;


function DataLookup() {
	resource_tree.Lookup.call(this);
}

DataLookup.prototype = new resource_tree.Lookup();
DataLookup.constructor = DataLookup;

DataLookup.prototype.lookup = function (path, callback) {
	var id = path.substr(1);
	if (db.hasOwnProperty(id)) callback(new DataResource(id));
	else callback(null);
}


var root = {
    '/': new ListResource('data/'),
    'data': new DataLookup()
};

resource_tree.createServer(root).listen(8080, "127.0.0.1");

console.log("http://127.0.0.1:8080/");
