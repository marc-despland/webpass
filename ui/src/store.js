/* eslint-disable  no-console*/
/* eslint-disable  no-unused-vars*/

import Vue from 'vue'
import Vuex from 'vuex'
import Cryptico from 'cryptico'

var STATUS= Object.freeze({NONE:0, LISTEN: 1, CONNECT: 2, CONNECTED: 3, LISTEN_SUCCESS: 4, LISTEN_FAILED: 5});

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

const OnMessagePlugin = store => {
	// called when the store is initialized
	store.subscribe((mutation, state) => {
		if (mutation.type=="SOCKET_ONMESSAGE") {
			console.log("SOCKET_ONMESSAGE ");
			var data=mutation.payload.data;
			if ((mutation.payload!==undefined) && (mutation.payload.data!==undefined)) {
				var request=JSON.parse(mutation.payload.data);
				if ((request!==undefined) && (request.code!==undefined)) {
					console.log("Received Message with code "+request.code);
					switch (request.code) {
						case "LISTEN_ACK": {
							if ((request.hasOwnProperty('code')) && (request.hasOwnProperty('channel'))) {
								store.commit("ON_MYPROTO_LISTEN_ACK", request);
							} else {
								console.log("Invalid request LISTEN_ACK : "+JSON.stringify(request));
							}
							break;
						}
						case "FAILED": {
							break;
						}
						case "CONNECTED": {
							if ((request.hasOwnProperty('code')) && (request.hasOwnProperty('channel')) && (request.hasOwnProperty('payload'))) {
								var connect_payload=Cryptico.decrypt(request.payload, state.rsakey);
								if (connect_payload.status==='success') {
									request.decoded=JSON.parse(connect_payload.plaintext);
									if ((request.decoded!==undefined) && (request.decoded.hasOwnProperty('channel'))) {
										if ((request.channel==request.decoded.channel) && (request.channel==state.connection.channelid)) {
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
							if ((request.hasOwnProperty('code')) && (request.hasOwnProperty('channel')) && (request.hasOwnProperty('payload'))) {
								var connected_payload=Cryptico.decrypt(request.payload, state.rsakey);
								if (connected_payload.status==='success') {
									request.decoded=JSON.parse(connected_payload.plaintext);
									if ((request.decoded!==undefined) && (request.decoded.hasOwnProperty('channel')) && (request.decoded.hasOwnProperty('key'))) {
										if ((request.channel==request.decoded.channel) && (request.channel==state.connection.channelid)) {
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
						case "MESSAGE": {
							if ((request.hasOwnProperty('code')) && (request.hasOwnProperty('channel')) && (request.hasOwnProperty('payload'))) {
								var message_payload=Cryptico.decrypt(request.payload, state.rsakey);
								if (message_payload.status==='success') {
									request.decoded=JSON.parse(message_payload.plaintext);
									if ((request.decoded!==undefined) && (request.decoded.hasOwnProperty('channel')) && (request.decoded.hasOwnProperty('login')) && (request.decoded.hasOwnProperty('password')) && (request.decoded.hasOwnProperty('message'))) {
										if ((request.channel==request.decoded.channel) && (request.channel==state.connection.channelid)) {
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
							console.log("Unknown Request Code");
						}
					}
				}
			}
		}
	});
}





export default new Vuex.Store({
	state: {
		request: '',
		rsakey: {},
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
		}
	},
	plugins: [OnMessagePlugin],
	mutations: {
		ON_MYPROTO_LISTEN_ACK (state, request) {
			console.log("ON_MYPROTO_LISTEN_ACK STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.LISTEN) {
				state.connection.channelid=request.channel;
				state.connection.initiator=true;
				state.connection.status=STATUS.LISTEN_SUCCESS;
				console.log("Change status to LISTEN_SUCCESS");
			}
		},
		ON_MYPROTO_CONNECTED (state, request) {
			console.log("ON_MYPROTO_CONNECTED STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.CONNECT) {
				state.connection.status=STATUS.CONNECTED;
				console.log("Change status to CONNECTED");
			}
		},
		ON_MYPROTO_CONNECT (state, request) {
			console.log("ON_MYPROTO_CONNECT STATUS:"+state.connection.status);
			if (state.connection.status==STATUS.LISTEN_SUCCESS) {
				state.connection.peerkey=request.decoded.key;
				var connected_handshake= {
					channel: state.connection.channelid
				}
				var result=Cryptico.encrypt(JSON.stringify(connected_handshake), state.connection.peerkey, state.rsakey);
				if (result.status=="success") {
					sendMessage(Vue.prototype.$socket, state, result.cipher, 'CONNECTED');
					state.connection.status=STATUS.CONNECTED;
					console.log("Change status to CONNECTED");
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
			}
		},
		SEND_MESSAGE(state, message) {
			console.log("SEND_MESSAGE:"+state.connection.status);
			if (state.connection.status==STATUS.CONNECTED) {
				message.channel=state.connection.channelid;
				var result=Cryptico.encrypt(JSON.stringify(message), state.connection.peerkey, state.rsakey);
				if (result.status=="success") {
					sendMessage(Vue.prototype.$socket, state, result.cipher, 'MESSAGE');
					console.log("Message sent");
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
			state.connection.channelid=params.channelid;
			state.connection.peerkey=params.key.replace(/ /g, "+");
			var handshake= {
				channel: state.connection.channelid,
				key: Cryptico.publicKeyString(state.rsakey)
			}
			var result=Cryptico.encrypt(JSON.stringify(handshake), state.connection.peerkey, state.rsakey);
			if (result.status==="success") {
				state.connection.status=STATUS.CONNECT;
				sendMessage(Vue.prototype.$socket, state, result.cipher, 'CONNECT');
			} else {
				console.log("Failed to encode handshake");
			}
		},
		LISTEN(state) {
			state.connection.status=STATUS.LISTEN;
			var request={
				code: 'LISTEN'
			}
			state.request=JSON.stringify(request);
			if (state.socket.isConnected) {
				console.log("INITIATE LISTEN STATUS");
				Vue.prototype.$socket.send(state.request);
				state.request='';
			} else {
				console.log("Not connected yet");
			}
		},
		/*INITIATE_CONNECT(state) {
			state.connection.status=STATUS.CONNECT;
			var handshake= {
				channel: state.connection.channelid,
				key: Cryptico.publicKeyString(state.rsakey)
			}
			var result=Cryptico.encrypt(JSON.stringify(handshake), state.connection.peerkey, state.rsakey);
			if (result.status==="success") {
				sendMessage(Vue.prototype.$socket, state, result.cipher, 'CONNECT');
			} else {
				console.log("Failed to encode handshake");
			}
		},*/
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
		},
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
		LISTEN (context, message) {
			return new Promise((resolve, reject) => {
				context.commit('LISTEN',message);
				resolve();
			})
		}
	},
	getters: {
		listen_success: (state) =>() =>{
			return (state.connection.status==STATUS.LISTEN_SUCCESS);
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
		}
	}
})
