var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');

var backend = new ShareDB();
createDoc(startServer);

function createDoc(callback) {
	var connection = backend.connect();
	var doc = connection.get('examples')
}