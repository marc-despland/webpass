'use strict';
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var openapi = require('express-openapi');
var path = require('path');
var cors = require('cors');
var http = require('http').createServer();
var WebSocketServer = require('ws').Server;

module.exports = app;


app.use(cors());
app.use(bodyParser.json());

openapi.initialize({
	apiDoc: require('./api/api-doc.js'),
	app: app,
	paths: path.resolve(__dirname, 'api-routes')
});

app.use(function(err, req, res, next) {
	res.status(err.status).json(err);
});


var server_port = process.env.LISTEN_PORT || 8080;
var server_ip_address = process.env.LISTEN_IP || '0.0.0.0';

var channels={};

let wss = new WebSocketServer({
	server: http,
	path: '/api/socket'
});
http.on('request', app);

wss.on('connection', function connection(ws) {
	console.log('CONNECTION !!!');
	ws.on('message', function incoming(message) {
		var action=JSON.parse(message);
		if (action.hasOwnProperty('code')) {
			switch (action.code) {
				case "LISTEN" :
					//generate a channel id 
					var channel=Math.floor((Math.random() * 10000000) + 1);
					channels[channel]={
						listen: ws
					};
					//send it to the server
					var response={};
					response.code="LISTEN_ACK";
					response.channel=channel;
					ws.send(JSON.stringify(response));
					break;
				case "CONNECT" :
					if (action.hasOwnProperty('channel')) {
						var channel=channels[action.channel];
						if ((channel!==undefined) && action.hasOwnProperty('payload')) {
							channels[action.channel].connected=ws;
							var response={};
							response.code="CONNECT";
							response.channel=action.channel;
							response.payload=action.payload;
							channels[action.channel].listen.send(JSON.stringify(response));
						} else {
							var response={};
							response.code="FAILED";
							response.message="No valid channel provided";
							ws.send(JSON.stringify(response));
						}
					}
					break;
				case "CONNECT_FAILED" :
					if (action.hasOwnProperty('channel')) {
						var channel=channels[action.channel];
						if (channel!==undefined) {
							var response={};
							response.code="CONNECT_FAILED";
							response.channel=action.channel;
							channels[action.channel].connected.send(JSON.stringify(response));
							channels[action.channel].connected.close();
							channels[action.channel].connected=undefined;
						} else {
							var response={};
							response.code="FAILED";
							response.message="No valid channel provided";
							ws.send(JSON.stringify(response));
						}
					}
					break;
				case "CONNECTED" :
					if (action.hasOwnProperty('channel')) {
						var channel=channels[action.channel];
						if ((channel!==undefined) && action.hasOwnProperty('payload')) {
							var response={};
							response.code="CONNECTED";
							response.channel=action.channel;
							response.payload=action.payload;
							channels[action.channel].connected.send(JSON.stringify(response));
						} else {
							var response={};
							response.code="FAILED";
							response.message="No valid channel provided";
							ws.send(JSON.stringify(response));
						}
						
					}
					break;
				case "MESSAGE" :
					if (action.hasOwnProperty('channel')) {
						var channel=channels[action.channel];
						if ((channel!==undefined) && action.hasOwnProperty('payload')) {
							var response={};
							response.code="MESSAGE";
							response.channel=action.channel;
							response.payload=action.payload;
							if (ws===channels[action.channel].connected) {
								channels[action.channel].listen.send(JSON.stringify(response));
							} else {
								channels[action.channel].connected.send(JSON.stringify(response));
							}
						} else {
							var response={};
							response.code="FAILED";
							response.message="No valid channel provided";
							ws.send(JSON.stringify(response));
						}
						
					}
					break;
				case "CONNECTED_FAILED" :
					if (action.hasOwnProperty('channel')) {
						var channel=channels[action.channel];
						if (channel!==undefined) {
							var response={};
							response.code="CONNECTED_FAILED";
							response.channel=action.channel;
							channels[action.channel].listen.send(JSON.stringify(response));
							ws.close();
							channels[action.channel].connected=undefined;
						} else {
							var response={};
							response.code="FAILED";
							response.message="No valid channel provided";
							ws.send(JSON.stringify(response));
						}
					}
					break;
			}
		}
		console.log('received: %s', message);
	});
	ws.on('close', function closing(message) {
		console.log(`closed: ${message}`);
	});
	ws.on('error', function onerror(message) {
		console.log(`onerror: ${message}`);
	});
});

http.listen(server_port, server_ip_address, function () {
	console.log( "Listening on " + server_ip_address + ", server_port " + server_port +" 1.0");
});