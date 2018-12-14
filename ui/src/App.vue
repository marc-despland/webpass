<template>
	<div id="app">
		<v-app>
			<Connecter v-if="connected"/>
			<Listener v-if="listen"/>
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


/*
// encodes characters such as ?,=,/,&,:
console.log(encodeURIComponent('abc==+/'));
// expected output: "%3Fx%3D%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"

console.log(decodeURIComponent('abc%3D%3D%2B%2F'));
// expected output: "%3Fx%3Dtest"
*/

export default {
	components: {
		Connecter,
		Listener
	},
	created() {
		console.log("Hash : "+JSON.stringify(this.$route.hash));
		console.log("Host : "+JSON.stringify(location));
		this.$store.commit('BASE_URL',location.protocol+"//"+location.host);
		this.$store.commit('GENEREATE_KEYS');
		if (this.$route.hash!=="") {
			var channel="";
			var key="";
			var hash=location.hash.substring(1);
			var params=hash.split("&");
			for (var i=0;i<params.length; i++) {
				var param=params[i].split("=");
				if (param.length==2) {
					if (param[0]==="channel") channel=param[1];
					if (param[0]==="key") key=decodeURIComponent(param[1]);
				}
			}
			//if ((this.$route.query.hasOwnProperty('channel')) && (this.$route.query.hasOwnProperty('key'))) {
			console.log("channel = "+ channel+"  key = "+key);
			if ((channel!=="") && (key!=="")) {
				//we are in CONNECT MODE
				var options= {
					channelid: channel,
					key: key
				}
				/*this.$store.commit('SWITCH_TO_CONNECT',params);
				this.$store.commit('INITIATE_CONNECT');*/
				this.$store.dispatch('CONNECT',options);
			} else {
				//this.$router.push("/listen");
				this.$store.dispatch('LISTEN');
			}
		} else {
			//this.$router.push("/listen");
			this.$store.dispatch('LISTEN');
		}
	},
	computed: {
		connected() {
			return (this.$store.getters.connected());
		},
		listen() {
			return (this.$store.getters.listen());
		}
	}
}
</script>
