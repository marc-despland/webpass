'use strict';

module.exports = {
	sendHandshake
};

function sendHandshake(ws, state, handshake, code) {
	var request={
		code: code,
		channel: state.connection.channelid,
		handshake: handshake
	}
	state.request=JSON.stringify(request);
	if (state.socket.isConnected) {
		console.log("SEND HANDSHAKE CODE : "+ code);
		ws.send(state.request);
		state.request='';
	} else {
		console.log("Not connected yet");
	}
}