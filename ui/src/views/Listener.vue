<template>
	<div class="home">
		<p>LISTEN</p>
		<div v-if="listen_success">
			<p>Commponent is Listening for connection</p>
			<p><a :href="connect_url">Connection URL</a></p>
			<p><VueQRCodeComponent :text="connect_url" size=300 color="#000000" bg-color="#FFFFFF" /></p>
		</div>
		<div v-else>
			<p>Wait initialization</p>
		</div>
	</div>
</template>

<script>

import VueQRCodeComponent from 'vue-qrcode-component'

export default {
	name: 'listener',
	components: {
		VueQRCodeComponent
	},
	computed: {
		listen_success() {
			return (this.$store.getters.listen_success());
		},
		connected() {
			return (this.$store.getters.connected());
		},
		channelid() {
			return (this.$store.getters.channelid());
		},
		publickey() {
			return (this.$store.getters.publickey());
		}, 
		peerkey() {
			return (this.$store.getters.peerkey());
		},
		connect_url() {
			return "https://webpass.kmt.orange.com?channel="+this.$store.getters.channelid()+"&key="+this.$store.getters.publickey();
		}
	},
	mounted() {
		console.log("Listener mounted")
		//this.$store.commit('INITIATE_LISTEN');

	},
	created() {

	}
}
</script>
