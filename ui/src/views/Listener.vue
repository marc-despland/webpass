<template>
	<div class="home">
		<v-layout>
			<v-flex xs12 sm6 offset-sm3>
				<v-card color="light-blue lighten-4">
					<v-card-title primary-title  class="cardtitle">
						<span>Listening for connection</span>
					</v-card-title>
					<div v-if="listen_success">
						<v-container fluid grid-list-xs>
							<v-layout row wrap >
								<v-flex d-flex xs12 class="join"><center>Channel : <span>{{channelid}}</span></center></v-flex>
								<v-flex d-flex xs12 class="join"><center>Challenge : <span>{{challenge}}</span></center></v-flex>
								<v-flex d-flex xs12><center><a :href="connect_url"><VueQRCodeComponent :text="connect_url" color="#000000" bg-color="#FFFFFF" class="qrcode"/></a></center></v-flex>
							</v-layout>
						</v-container>
					</div>
					<div v-else>
						<p>Wait initialization ...</p>
					</div>
				</v-card>
			</v-flex>
		</v-layout>
	</div>
</template>
<style>

.join {
	text-align: center;
	font-weight: bold;
	font-size: 20px;
}
.cardtitle {
	text-align: center;
	font-weight: bold;
	font-size: 30px;
	background-color: #0D47A1;
	color: #FFFFFF;
}
.home {
	margin-top: 20px;
}
.qrcode {
	margin-top:20px;
	margin-bottom:20px;
}
</style>
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
