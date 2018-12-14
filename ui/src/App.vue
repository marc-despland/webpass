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

export default {
	components: {
		Connecter,
		Listener
	},
	mounted() {
		this.$store.commit('GENEREATE_KEYS');
		if ((this.$route.query.hasOwnProperty('channel')) && (this.$route.query.hasOwnProperty('key'))) {
			//we are in CONNECT MODE
			var params= {
				channelid: this.$route.query.channel,
				key: this.$route.query.key
			}
			/*this.$store.commit('SWITCH_TO_CONNECT',params);
			this.$store.commit('INITIATE_CONNECT');*/
			this.$store.dispatch('CONNECT',params);
		} else {
			//this.$router.push("/listen");
			this.$store.dispatch('LISTEN',params);
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
