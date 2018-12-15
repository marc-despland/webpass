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
			console.log("Received Message "+ action.code);
			switch (action.code) {
				case "LISTEN" :
					//generate a channel id 
					var channel=Math.floor((Math.random() * 10000000) + 1);
					while (channels.hasOwnProperty(channel)) {
						channel=Math.floor((Math.random() * 10000000) + 1);
					}
					console.log("	Creating Channel "+channel);
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
					//Send by the connect PEER to connect to the listen one
					if (action.hasOwnProperty('channel') && channels.hasOwnProperty(action.channel)) {
						console.log("	Channel "+action.channel);
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
				case "JOIN_REQUEST" :
					//Send by the connect PEER to connect to the listen one
					if (action.hasOwnProperty('channel') && channels.hasOwnProperty(action.channel)) {
						console.log("	Channel "+action.channel);
						var channel=channels[action.channel];
						if ((channel!==undefined) && action.hasOwnProperty('key')) {
							channels[action.channel].connected=ws;
							var response={};
							response.code="JOIN_REQUEST";
							response.channel=action.channel;
							response.key=action.key;
							channels.listen.send(JSON.stringify(response));
						}
					}
					break;
				case "JOIN_CHALLENGE" :
					//Send by the connect PEER to connect to the listen one
					if (action.hasOwnProperty('channel') && channels.hasOwnProperty(action.channel)) {
						console.log("	Channel "+action.channel);
						var channel=channels[action.channel];
						if ((channel!==undefined) && action.hasOwnProperty('payload')) {
							if (channel.listen===ws) {
								var response={};
								response.code="JOIN_CHALLENGE";
								response.channel=action.channel;
								response.payload=action.payload;
								channel.connected.send(JSON.stringify(response));
							}
						}
					}
					break;
				case "JOIN_SUCCESS" :
					//Send by the connect PEER to connect to the listen one
					if (action.hasOwnProperty('channel') && channels.hasOwnProperty(action.channel)) {
						console.log("	Channel "+action.channel);
						var channel=channels[action.channel];
						if ((channel!==undefined) && action.hasOwnProperty('payload')) {
							if (channel.connected===ws) {
								var response={};
								response.code="JOIN_SUCCESS";
								response.channel=action.channel;
								response.payload=action.payload;
								channel.listen.send(JSON.stringify(response));
							}
						}
					}
					break;
				case "CONNECT_FAILED" :
					//Send by the listen PEER to indicate it reject the connection
					//Listen peer should close the connection
					if (action.hasOwnProperty('channel') && channels.hasOwnProperty(action.channel)) {
						console.log("	Channel "+action.channel);
						var channel=channels[action.channel];
						if (channel.listen===ws) {
							if (channel!==undefined) {
								var response={};
								response.code="CONNECT_FAILED";
								response.channel=action.channel;
								channel.connected.send(JSON.stringify(response));
								channel.connected.close();
								channel.listen.close();
								delete channels[action.channel];
							}
						} else {
							console.log("	Invalid Peer ... this is not the listen one");
						}
					}
					break;
				case "CONNECTED" :
					if (action.hasOwnProperty('channel') && channels.hasOwnProperty(action.channel)) {
						var channel=channels[action.channel];
						console.log("	Channel "+action.channel);
						if (channel.listen===ws) {
							if ((channel!==undefined) && action.hasOwnProperty('payload')) {
								var response={};
								response.code="CONNECTED";
								response.channel=action.channel;
								response.payload=action.payload;
								channel.connected.send(JSON.stringify(response));
							} else {
								var response={};
								response.code="FAILED";
								response.message="No valid channel provided";
								ws.send(JSON.stringify(response));
							}
						} else {
							console.log("	Invalid Peer ... this is not the connected one");
						}
					}
					break;
				case "MESSAGE" :
					if (action.hasOwnProperty('channel') && channels.hasOwnProperty(action.channel)) {
						var channel=channels[action.channel];
						console.log("	Channel "+action.channel);
						if ((channel!==undefined) && action.hasOwnProperty('payload')) {
							var response={};
							response.code="MESSAGE";
							response.channel=action.channel;
							response.payload=action.payload;
							if (ws===channel.connected) {
								channels[action.channel].listen.send(JSON.stringify(response));
							} else if (ws===channel.listen) {
								channels[action.channel].connected.send(JSON.stringify(response));
							} else {
								console.log("	Invalid Peer ... ");
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
					if (action.hasOwnProperty('channel') && channels.hasOwnProperty(action.channel)) {
						var channel=channels[action.channel];
						console.log("	Channel "+action.channel);
						if (channel.connected===ws) {
							if (channel!==undefined) {
								var response={};
								response.code="CONNECTED_FAILED";
								response.channel=action.channel;
								channel.listen.send(JSON.stringify(response));
								channel.connected.close();
								channel.listen.close();
								delete channels[action.channel]
							} else {
								var response={};
								response.code="FAILED";
								response.message="No valid channel provided";
								ws.send(JSON.stringify(response));
							}
						} else {
							console.log("	Invalid Peer ... this is not the connected one");
						}
					}
					break;
			}
		}
	});
	ws.on('close', function closing(message) {
		console.log(`closed: ${message}`);
		for(var key in channels) {
			if (channels.hasOwnProperty(key)) {
				var channel=channels[key];
				if (channel!==undefined) {
					if (channel.listen===ws) {
						console.log("	Channel "+key);
						var response={};
						response.code="CLOSE";
						response.channel=key;
						response.message="Remote Peer close the connection";
						channel.connected.send(JSON.stringify(response));
						channel.connected.close();
						delete channels[key];
					} else if (channel.connected===ws) {
						console.log("	Channel "+key);
						var response={};
						response.code="CLOSE";
						response.channel=key;
						response.message="Remote Peer close the connection";
						channel.listen.send(JSON.stringify(response));
						channel.listen.close();
						delete channels[key];
					}
				}
			}
		}
	});
	ws.on('error', function onerror(message) {
		console.log(`onerror: ${message}`);
	});
});

http.listen(server_port, server_ip_address, function () {
	console.log( "Listening on " + server_ip_address + ", server_port " + server_port +" 1.0");
});