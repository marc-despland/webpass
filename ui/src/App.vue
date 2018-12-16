<template>
	<div id="app">
		<v-app>
			<Connecter v-if="connected"/>
			<Listener v-if="listen"/>
			<StartScreen v-if="none"/>
			<JoinRequest v-if="join"/>
			<JoinReceived v-if="joinReceived"/>
			<JoinRequested v-if="joinRequested"/>
		</v-app>
	</div>
</template>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>

<script>

import Connecter from './views/Connecter.vue'
import Listener from './views/Listener.vue'
import StartScreen from './views/StartScreen.vue'
import JoinRequest from './views/JoinRequest.vue'
import JoinRequested from './views/JoinRequested.vue'
import JoinReceived from './views/JoinReceived.vue'
import STATUS from './connection_status'


export default {
	components: {
		Connecter,
		Listener,
		StartScreen,
		JoinRequest,
		JoinRequested,
		JoinReceived,
	},
	created() {
		console.log("Hash : "+JSON.stringify(this.$route.hash));
		console.log("Host : "+JSON.stringify(location));
		this.$store.commit('BASE_URL',location.protocol+"//"+location.host);
		this.$store.commit('GENEREATE_KEYS');
		if (this.$route.hash!=="") {
			var channel="";
			var key="";
			var challenge="";
			var hash=location.hash.substring(1);
			var params=hash.split("&");
			for (var i=0;i<params.length; i++) {
				var param=params[i].split("=");
				if (param.length==2) {
					if (param[0]==="channel") channel=param[1];
					if (param[0]==="key") key=decodeURIComponent(param[1]);
					if (param[0]==="challenge") challenge=param[1];
				}
			}
			//if ((this.$route.query.hasOwnProperty('channel')) && (this.$route.query.hasOwnProperty('key'))) {
			if ((channel!=="") && (key!=="") && (challenge!=="")) {
				//we are in CONNECT MODE
				var options= {
					channelid: channel,
					key: key,
					challenge: challenge
				}
				this.$store.dispatch('CONNECT',options);
			} 
		} 
	},
	computed: {
		connected() {
			return (this.$store.getters.status()==STATUS.CONNECTED);
		},
		listen() {
			return ((this.$store.getters.status()==STATUS.LISTEN_SUCCESS) || (this.$store.getters.status()==STATUS.LISTEN));
		},
		none() {
			return (this.$store.getters.status()==STATUS.NONE);
		},
		join() {
			return (this.$store.getters.status()==STATUS.JOIN);
		},
		joinReceived() {
			return (this.$store.getters.status()==STATUS.JOIN_RECEIVED);
		},
		joinRequested() {
			return (this.$store.getters.status()==STATUS.JOIN_REQUESTED);
		},
		joinChallenged() {
			return (this.$store.getters.status()==STATUS.JOIN_CHALLENGED);
		},
		joinChallengeReceived() {
			return (this.$store.getters.status()==STATUS.JOIN_CHALLENGE_RECEIVED);
		}
	}
}
</script>
