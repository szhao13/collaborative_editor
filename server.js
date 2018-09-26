var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');

var backend = new ShareDB();
createDoc(startServer);

function createDoc(callback) {
	var connection = backend.connect();
	var doc = connection.get('examples');
	doc.fetch(function(err) {
		if (err) throw err;
		if (doc.type === null) {
			doc.create('', callback);
			return;
		}
	callback();
	});
}

function startServer() {

	var app = express();
	app.use(express.static('static'));
	var server = http.createServer(app);

	vjar wss = new WebSocket.Server({server: server});
	wss.on('connect', function(ws, req) {
		var stream = new WebSocketJSONStream(ws);
		backend.listen(stream);
	});

	server.listen(8080);
	console.log('Listening on http://localhost:8080'); 
}
