/* eslint-disable  no-console*/
/* eslint-disable  no-unused-vars*/
'use strict';
import Vue from 'vue'
import Vuex from 'vuex'
import Cryptico from 'cryptico'

import STATUS from './connection_status'

//var STATUS= Object.freeze({NONE:0, LISTEN: 1, CONNECT: 2, CONNECTED: 3, LISTEN_SUCCESS: 4, LISTEN_FAILED: 5, JOIN: 6, JOIN_CHALLENGED: 7, JOIN_REQUEST: 8, JOIN_RECEIVED: 9, JOIN_CHALLENGE_RECEIVED: 10});

Vue.use(Vuex)

function sendMessage(ws, state, payload, code) {
	console.log("sendMessage "+payload)
	var request={
		code: code,
		channel: state.connection.channelid,
		payload: payload
	}
	state.request=JSON.stringify(request);
	console.log("Request :"+state.request)
	if (state.socket.isConnected) {
		console.log("Send Message Code: "+ code);
		ws.send(state.request);
		state.request='';
	} else {
		console.log("Not connected yet");
	}
}


function generateChallenge(digit) {
	var challenge="";
	for (var i=0; i< digit; i++) {
		var code=Math.floor((Math.random() * 10));
		challenge+=code;
	}
	return challenge;
}


const OnMessagePlugin = store => {
	// called when the store is initialized
	store.subscribe((mutation, state) => {
		var payload;
		if (mutation.type=="SOCKET_ONMESSAGE") {
			console.log("SOCKET_ONMESSAGE ");
			var data=mutation.payload.data;
			if ((mutation.payload!==undefined) && (mutation.payload.data!==undefined)) {
				var request=JSON.parse(mutation.payload.data);
				if ((request!==undefined) && (request.hasOwnProperty('code'))) {
					console.log("Received Message with code "+request.code);
					switch (request.code) {
						case "LISTEN_ACK": {
							if (request.hasOwnProperty('channel')) {
								store.commit("ON_MYPROTO_LISTEN_ACK", request);
							} else {
								console.log("Invalid request LISTEN_ACK : "+JSON.stringify(request));
							}
							break;
						}
						case "CLOSE": {
							if (request.hasOwnProperty('channel')) {
								store.commit("ON_CLOSE", request);
							} else {
								console.log("Invalid request CLOSE : "+JSON.stringify(request));
							}
							break;
						}
						case "FAILED": {
							break;
						}
						case "CONNECTED": {
							if ((request.hasOwnProperty('channel')) && (request.hasOwnProperty('payload'))) {
								payload=Cryptico.decrypt(request.payload, state.rsakey);
								if (payload.status==='success') {
									request.decoded=JSON.parse(payload.plaintext);
									if ((request.decoded!==undefined) && (request.decoded.hasOwnProperty('channel')) && (request.decoded.hasOwnProperty('challenge'))) {
										if ((request.channel==request.decoded.channel) && (request.channel==state.connection.channelid) && (request.decoded.challenge==state.join.challenge)) {
											store.commit("ON_MYPROTO_CONNECTED", request);
										} else {
											console.log("Invalid channel on CONNECTED");
										}
									} else {
										console.log("Invalid decoded payload on CONNECTED");
									}
								}
							}
							break;
						}
						case "CONNECT": {
							console.log("CONNECT : "+JSON.stringify(request));
							if ((request.hasOwnProperty('channel')) && (request.hasOwnProperty('payload'))) {
								payload=Cryptico.decrypt(request.payload, state.rsakey);
								if (payload.status==='success') {
									request.decoded=JSON.parse(payload.plaintext);
									if ((request.decoded!==undefined) && (request.decoded.hasOwnProperty('channel')) && (request.decoded.hasOwnProperty('key')) && (request.decoded.hasOwnProperty('challenge')) && (request.decoded.hasOwnProperty('mychallenge'))) {
										if ((request.channel==request.decoded.channel) && (request.channel==state.connection.channelid)  && (request.decoded.challenge==state.join.challenge)) {
											store.commit("ON_MYPROTO_CONNECT", request);
										} else {
											console.log("Invalid channel on CONNECT");
										}
									} else {
										console.log("Invalid decoded payload on CONNECT");
									}
								}
							}
							break;
						}
						case "JOIN": {
							console.log("JOIN : "+JSON.stringify(request));
							if ((request.hasOwnProperty('channel')) && (request.hasOwnProperty('key')) && (request.hasOwnProperty('challenge'))) {
								if ((request.channel==state.connection.channelid) && (state.join.challenge=request.challenge)) {
									store.commit("ON_MYPROTO_JOIN", request);
								} else {
									store.commit("ON_CLOSE");
								}
							} else {
								store.commit("ON_CLOSE");
							}
							break;
						}
						case "JOIN_CHALLENGE": {
							console.log("JOIN_CHALLENGE : "+JSON.stringify(request));
							if ((request.hasOwnProperty('channel')) && (request.hasOwnProperty('payload'))) {
								payload=Cryptico.decrypt(request.payload, state.rsakey);
								if (payload.status==='success') {
									request.decoded=JSON.parse(payload.plaintext);
									if ((request.decoded!==undefined) && (request.decoded.hasOwnProperty('channel')) && (request.decoded.hasOwnProperty('key')) && (request.decoded.hasOwnProperty('challenge'))) {
										if ((request.channel==request.decoded.channel) && (request.channel==state.connection.channelid) && (state.join.challenge==request.decoded.challenge)) {
											store.commit("ON_MYPROTO_JOIN_CHALLENGE", request);
										} else {
											store.commit("ON_CLOSE");
										}
									} else {
										store.commit("ON_CLOSE");
									}
								}
							}
							break;
						}
						case "JOIN_SUCCESS": {
							console.log("JOIN_SUCCESS : "+JSON.stringify(request));
							if ((request.hasOwnProperty('channel')) && (request.hasOwnProperty('payload'))) {
								payload=Cryptico.decrypt(request.payload, state.rsakey);
								if (payload.status==='success') {
									request.decoded=JSON.parse(payload.plaintext);
									if ((request.decoded!==undefined) && (request.decoded.hasOwnProperty('channel')) && (request.decoded.hasOwnProperty('challenge'))) {
										if ((request.channel==request.decoded.channel) && (request.channel==state.connection.channelid) && (state.join.challenge==request.decoded.challenge)) {
											store.commit("ON_MYPROTO_JOIN_SUCCESS", request);
										} else {
											store.commit("ON_CLOSE");
										}
									} else {
										store.commit("ON_CLOSE");
									}
								}
							}
							break;
						}
						case "MESSAGE": {
							if ((request.hasOwnProperty('channel')) && (request.hasOwnProperty('payload'))) {
								payload=Cryptico.decrypt(request.payload, state.rsakey);
								if (payload.status==='success') {
									request.decoded=JSON.parse(payload.plaintext);
									if ((request.decoded!==undefined) && (request.decoded.hasOwnProperty('channel')) && (request.decoded.hasOwnProperty('login')) && (request.decoded.hasOwnProperty('password')) && (request.decoded.hasOwnProperty('message')) && (request.decoded.hasOwnProperty('challenge'))) {
										if ((request.channel==request.decoded.channel) && (request.channel==state.connection.channelid) && (request.decoded.challenge==state.join.challenge)) {
											store.commit("ON_MYPROTO_MESSAGE", request);
										} else {
											console.log("Invalid channel on MESSAGE");
										}
									} else {
										console.log("Invalid decoded payload on MESSAGE");
									}
								}
							}
							break;
						}
						default: {
							console.log("Unknown Request Code "+request.code);
						}
					}
				}
			}
		}
	});
}

/*
JOIN SEQUENCE
@startuml
Connect -> Listen: JOIN(channelid, pubkey, challenge)
Listen --> Connect: JOIN_CHALLENGE(pubkey, challenge)
//Connect -> Listen: JOIN_SUCCESS(challenge)
@enduml


State On Connect Side :
@startuml
[*] --> NONE
NONE --> JOIN : Click to choose join
JOIN --> JOIN_REQUESTED : send JOIN request
JOIN_REQUESTED --> CONNECTED : received JOIN_CHALLENGE
CONNECTED --> [*]
@enduml
JOIN_REQUESTED --> JOIN_CHALLENGE_RECEIVED : received JOIN_CHALLENGE
JOIN_CHALLENGE_RECEIVED --> CONNECTED : send JOIN_SUCCESS


State On Listen Side :
@startuml
[*] --> LISTEN
LISTEN --> JOIN_RECEIVED : received JOIN
JOIN_RECEIVED --> CONNECTED : send JOIN_CHALLENGE
CONNECTED --> [*]
@enduml
JOIN_RECEIVED --> JOIN_CHALLENGED : send JOIN_CHALLENGE
JOIN_CHALLENGED --> CONNECTED : received JOIN_SUCCESS
*/



export default new Vuex.Store({
	state: {
		request: '',
		rsakey: {},
		join: {
			challenge: 0,
			peerchallenge: 0
		},
		connection: {
			channelid: 0,
			peerkey: '',
			status: STATUS.NONE
		},
		info: {
			login:'',
			password: '',
			message: ''
		},
		socket: {
			isConnected: false,
			message: '',
			reconnectError: false,
		},
		baseUrl: ''
	},
	plugins: [OnMessagePlugin],
	mutations: {
		BASE_URL (state, url) {
			state.baseUrl=url;
		},
		ON_CLOSE (state, request) {
			console.log("ON_CLOSE:"+state.connection.status);
			state.connection.status=STATUS.NONE
			Vue.prototype.$disconnect();
			state.connection.channelid="";
			state.connection.peerkey="";
			state.info.login="";
			state.info.password="";
			state.info.message="";
			state.request="";
			console.log("	=> "+state.connection.status);
		},
		ON_MYPROTO_JOIN(state, request) {
			console.log("ON_MYPROTO_JOIN STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.LISTEN_SUCCESS) {
				state.connection.peerkey=request.key;
				state.connection.status=STATUS.JOIN_RECEIVED;
				console.log("	=> "+state.connection.status);
			}
		},
		ON_MYPROTO_JOIN_CHALLENGE (state, request) {
			console.log("ON_MYPROTO_JOIN_CHALLENGE STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.JOIN_REQUESTED) {
				state.connection.peerkey=request.decoded.key;
				state.connection.status=STATUS.CONNECTED;//JOIN_CHALLENGE_RECEIVED;
				console.log("	=> "+state.connection.status);
			}
		},
		ON_MYPROTO_JOIN_SUCCESS (state, request) {
			console.log("ON_MYPROTO_JOIN_SUCCESS STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.JOIN_CHALLENGED) {
				state.connection.status=STATUS.CONNECTED;
				console.log("	=> "+state.connection.status);
			}
		},
		ON_MYPROTO_LISTEN_ACK (state, request) {
			console.log("ON_MYPROTO_LISTEN_ACK STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.LISTEN) {
				state.connection.channelid=request.channel;
				state.connection.status=STATUS.LISTEN_SUCCESS;
				console.log("	=> "+state.connection.status);
			}
		},
		ON_MYPROTO_CONNECTED (state, request) {
			console.log("ON_MYPROTO_CONNECTED STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.CONNECT) {
				state.connection.status=STATUS.CONNECTED;
				console.log("	=> "+state.connection.status);
			}
		},
		ON_MYPROTO_CONNECT (state, request) {
			console.log("ON_MYPROTO_CONNECT STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.LISTEN_SUCCESS) {
				state.connection.peerkey=request.decoded.key;
				state.join.peerchallenge=request.decoded.mychallenge;
				var connected_handshake= {
					channel: state.connection.channelid,
					challenge: state.join.peerchallenge
				}
				var result=Cryptico.encrypt(JSON.stringify(connected_handshake), state.connection.peerkey, state.rsakey);
				if (result.status=="success") {
					sendMessage(Vue.prototype.$socket, state, result.cipher, 'CONNECTED');
					state.connection.status=STATUS.CONNECTED;
					console.log("	=> "+state.connection.status);
				} else {
					console.log("Failed to encode payload");
				}
			}
		},
		ON_MYPROTO_MESSAGE(state, request) {
			console.log("ON_MYPROTO_MESSAGE STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.CONNECTED) {
				state.info.login=request.decoded.login;
				state.info.password=request.decoded.password;
				state.info.message=request.decoded.message;
				console.log("	=> "+state.connection.status);
			}
		},
		SEND_MESSAGE(state, message) {
			console.log("SEND_MESSAGE:"+state.connection.status);
			if (state.connection.status==STATUS.CONNECTED) {
				message.channel=state.connection.channelid;
				message.challenge=state.join.peerchallenge;
				var result=Cryptico.encrypt(JSON.stringify(message), state.connection.peerkey, state.rsakey);
				if (result.status=="success") {
					sendMessage(Vue.prototype.$socket, state, result.cipher, 'MESSAGE');
					console.log("	=> "+state.connection.status);
				} else {
					console.log("Failed to encode payload");
				}
			}
		},
		GENEREATE_KEYS (state) {
			state.connection.status==STATUS.NONE;
			console.log("RSA key generation started");
			state.rsakey=Cryptico.generateRSAKey("This is a secret passphrase to generate my RSA key "+Math.floor((Math.random() * 10000000) + 1), 512);
			console.log("RSA key is generated");
		},
		SWITCH_TO_CONNECT(state, params) {
			console.log("SWITCH_TO_CONNECT : "+params.channelid+" key: "+params.key);
			if (state.connection.status==STATUS.NONE) {
				Vue.prototype.$connect();
				state.join.challenge=generateChallenge(4);
				state.connection.channelid=params.channelid;
				state.join.peerchallenge=params.challenge;
				state.connection.peerkey=params.key;//.replace(/ /g, "+");
				var handshake= {
					channel: state.connection.channelid,
					key: Cryptico.publicKeyString(state.rsakey),
					challenge: state.join.peerchallenge,
					mychallenge: state.join.challenge
				}
				var result=Cryptico.encrypt(JSON.stringify(handshake), state.connection.peerkey, state.rsakey);
				if (result.status==="success") {
					state.connection.status=STATUS.CONNECT;
					sendMessage(Vue.prototype.$socket, state, result.cipher, 'CONNECT');
					console.log("	=> "+state.connection.status);
				} else {
					console.log("Failed to encode handshake");
				}
			}
		},
		LISTEN(state) {
			console.log("LISTEN STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.NONE) {
				Vue.prototype.$connect();
				state.join.challenge=generateChallenge(4);
				state.connection.status=STATUS.LISTEN;
				var request={
					code: 'LISTEN'
				}
				state.request=JSON.stringify(request);
				console.log("	=> "+state.connection.status);
				if (state.socket.isConnected) {
					Vue.prototype.$socket.send(state.request);
					state.request='';
				} else {
					console.log("Not connected yet");
				}
			}
		},
		JOIN_REQUEST (state, options) {
			console.log("JOIN REQUEST:"+state.connection.status);
			if (state.connection.status==STATUS.JOIN) {
				state.connection.status=STATUS.JOIN_REQUESTED;
				state.connection.channelid=options.channel;
				state.join.peerchallenge=options.challenge;
				var request={
					code: 'JOIN',
					channel: options.channel,
					challenge: options.challenge,
					key: Cryptico.publicKeyString(state.rsakey)
				}
				state.request=JSON.stringify(request);
				console.log("	=> "+state.connection.status);
				if (state.socket.isConnected) {
					Vue.prototype.$socket.send(state.request);
					state.request='';
				} else {
					console.log("Not connected yet");
				}
			}
		},
		JOIN (state) {
			console.log("JOIN STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.NONE) {
				Vue.prototype.$connect();
				state.connection.status=STATUS.JOIN;
				state.join.challenge=generateChallenge(4);
				console.log("	=> "+state.connection.status);
			}
		},
		JOIN_SUCCESS (state, challenge) {
			console.log("JOIN_CHALLENGE STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.JOIN_CHALLENGE_RECEIVED) {
				state.join.peerchallenge=challenge;
				var handshake={
					channel: state.connection.channelid,
					challenge: challenge
				}
				var result=Cryptico.encrypt(JSON.stringify(handshake), state.connection.peerkey, state.rsakey);
				if (result.status==="success") {
					state.connection.status=STATUS.CONNECTED;
					console.log("	=> "+state.connection.status);
					sendMessage(Vue.prototype.$socket, state, result.cipher, 'JOIN_SUCCESS');
				} else {
					console.log("Failed to encode handshake");
				}
			}
		},
		JOIN_CHALLENGE (state, challenge) {
			console.log("JOIN_CHALLENGE STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.JOIN_RECEIVED) {
				state.join.peerchallenge=challenge;
				var handshake={
					channel: state.connection.channelid,
					challenge: challenge,
					key: Cryptico.publicKeyString(state.rsakey)
				}
				var result=Cryptico.encrypt(JSON.stringify(handshake), state.connection.peerkey, state.rsakey);
				if (result.status==="success") {
					state.connection.status=STATUS.CONNECTED;
					console.log("	=> "+state.connection.status);
					sendMessage(Vue.prototype.$socket, state, result.cipher, 'JOIN_CHALLENGE');
				} else {
					console.log("Failed to encode handshake");
				}
			}
		},
		SOCKET_ONOPEN (state, event)  {
			console.log("Socket open")
			Vue.prototype.$socket = event.currentTarget
			state.socket.isConnected = true
			if (state.request!=='') {
				Vue.prototype.$socket.send(state.request);
				state.request='';
			}
		},
		SOCKET_ONCLOSE (state, event)  {
			console.log("Socket on close")
			state.socket.isConnected = false
		},
		SOCKET_ONERROR (state, event)  {
			console.error(state, event)
		},
		// default handler called for all methods
		SOCKET_ONMESSAGE (state, message)  {
			//We let the plugin managing it
		},
		// mutations for reconnect methods
		SOCKET_RECONNECT(state, count) {
			console.info(state, count)
		},
		SOCKET_RECONNECT_ERROR(state) {
			console.log("Socket reconnect error")
			state.socket.reconnectError = true;
		}
	},
	actions: {
		SEND_MESSAGE (context, message) {
			return new Promise((resolve, reject) => {
				context.commit('SEND_MESSAGE',message);
				resolve();
			})
		},
		CONNECT (context, message) {
			return new Promise((resolve, reject) => {
				context.commit('SWITCH_TO_CONNECT',message);
				resolve();
			})
		},
		JOIN (context) {
			return new Promise((resolve, reject) => {
				context.commit('JOIN');
				resolve();
			})
		},
		JOIN_REQUEST (context, options) {
			return new Promise((resolve, reject) => {
				context.commit('JOIN_REQUEST',options);
				resolve();
			})
		},
		JOIN_SUCCESS (context, challenge) {
			return new Promise((resolve, reject) => {
				context.commit('JOIN_SUCCESS',challenge);
				resolve();
			})
		},
		JOIN_CHALLENGE (context, challenge) {
			return new Promise((resolve, reject) => {
				context.commit('JOIN_CHALLENGE',challenge);
				resolve();
			})
		},
		LISTEN (context) {
			return new Promise((resolve, reject) => {
				context.commit('LISTEN');
				resolve();
			})
		}
	},
	getters: {
		challenge: (state) =>() =>{
			return (state.join.challenge);
		},
		status: (state) =>() =>{
			return (state.connection.status);
		},
		listen_success: (state) =>() =>{
			return (state.connection.status==STATUS.LISTEN_SUCCESS);
		},
		join_challenge: (state) =>() =>{
			return (state.connection.status==STATUS.JOIN_CHALLENGE);
		},
		none: (state) =>() =>{
			return (state.connection.status==STATUS.NONE);
		},
		connected: (state) =>() =>{
			return (state.connection.status==STATUS.CONNECTED);
		},
		listen: (state) =>() =>{
			return ((state.connection.status==STATUS.LISTEN_SUCCESS) || (state.connection.status==STATUS.LISTEN));
		},
		channelid: (state) =>() =>{
			return (state.connection.channelid);
		},
		publickey: (state) =>() =>{
			return (Cryptico.publicKeyString(state.rsakey));
		},
		peerkey: (state) =>() =>{
			return (state.connection.peerkey);
		},
		login: (state) =>() =>{
			return (state.info.login);
		},
		password: (state) =>() =>{
			return (state.info.password);
		},
		message: (state) =>() =>{
			return (state.info.message);
		},
		baseUrl: (state) =>() =>{
			return (state.baseUrl);
		}
	}
})
