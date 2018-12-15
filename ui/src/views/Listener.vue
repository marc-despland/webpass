<template>
	<div class="home">
		<div v-if="listen_success">
			<v-container fluid grid-list-xs>
				<v-layout row wrap >
					<v-flex d-flex xs12><center>Listening for connection</center></v-flex>
					<v-flex d-flex xs12><center>Channel {{channelid}}</center></v-flex>
					<v-flex d-flex xs12><center>Challenge {{challenge}}</center></v-flex>
					<v-flex d-flex xs12><center><a :href="connect_url"><VueQRCodeComponent :text="connect_url" color="#000000" bg-color="#FFFFFF" /></a></center></v-flex>
				</v-layout>
			</v-container>
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
		channelid() {
			return (this.$store.getters.channelid());
		},
		listen_success() {
			return (this.$store.getters.listen_success());
		},
		connected() {
			return (this.$store.getters.connected());
		},
		publickey() {
			return (this.$store.getters.publickey());
		}, 
		peerkey() {
			return (this.$store.getters.peerkey());
		},
		connect_url() {
			return this.$store.getters.baseUrl()+"?#channel="+this.$store.getters.channelid()+"&challenge="+this.$store.getters.challenge()+"&key="+encodeURIComponent(this.$store.getters.publickey());
		},
		challenge() {
			return (this.$store.getters.challenge());
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
