#!/usr/bin/env node

var resource_tree = require('./resource-tree');
var fs = require('fs');
var url = require('url');
var formidable = require('formidable'); // npm install formidable


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

	res.write(
		"<!DOCTYPE html><html><head><title>CRUD</title><script>" +
		"function xhr(method, url) { var x = new XMLHttpRequest(); x.open(method,url,true); x.send(); }\n" +
		"function del(d) { xhr('DELETE', d); }\n" +
		"</script></head><body><ul>"
	);
	for (var d in db) {
		var url = this.dataRoot + d;
		res.write(
			'<li id="' + d + '"><a href="' + url + '">' + db[d].name + '</a> ' +
			'<a href="javascript:del(\'' + url + '\');var n=document.getElementById(\'' + d + '\');n.parentNode.removeChild(n);">[del]</a></li>'
		);
	}
	res.end(
		"</ul><form enctype=\"multipart/form-data\" method=\"POST\"><input type='file' name='file' multiple='multiple'>" +
		"<input type='submit'></form></body></html>"
	);
};

function generate500(res, msg) {
	res.writeHead(500, {"Content-Type": "text/plain;charset=utf-8"});
	res.end("Internal Server Error: " + err);
}

ListResource.prototype.http_POST = function (req, res) {
	var self = this;
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		if (err) return generate500(res, err);

		fs.readFile(files.file.path, function (err, data) {
			if (err) return generate500(res, err);

			var item = {
				"name": files.file.name,
				"Content-Type": files.file.type,
				"body": data
			};
			var id = db.push(item) - 1;

			res.writeHead(201, {
				"Content-Type": "text/html;charset=utf-8",
				"Location": url.resolve(req.url, self.dataRoot + id)
			});
			res.end("<!DOCTYPE html><script>window.location = '" + req.url + "'</script>Go back to <a href='" + req.url + "'>the listing");
		});
	});
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
