<template>
	<div class="home">
		<p>LISTEN</p>
		<div v-if="listen_success">
			<p>Commponent is Listening for connection ...</p>
			<p><center><a :href="connect_url"><VueQRCodeComponent :text="connect_url" color="#000000" bg-color="#FFFFFF" /></a></center></p>
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
			return this.$store.getters.baseUrl()+"?#channel="+this.$store.getters.channelid()+"&key="+encodeURIComponent(this.$store.getters.publickey());
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
