<template>
	<div class="home">
		<v-layout>
			<v-flex xs12 sm6 offset-sm3>
				<v-card color="light-blue lighten-4">
					<v-card-title primary-title class="cardtitle">
						<span>Connected</span>
					</v-card-title>
					<div>
						<ReceivedMessage/>
						<SendMessage/>
					</div>
				</v-card>
			</v-flex>
		</v-layout>
	</div>
</template>
<style>
.cardtitle {
	text-align: center;
	font-weight: bold;
	font-size: 30px;
	background-color: #0D47A1;
	color: #FFFFFF;
}
.button { 
	font-weight: bold;
}
.challenge {
	text-align: center;
	font-weight: bold;
	font-size: 60px;
}
.title {
	text-align: center;
	font-weight: bold;
	font-size: 30px;
}
.home {
	margin-top: 20px;
}
</style>

<script>
import ReceivedMessage from '../components/ReceivedMessage';
import SendMessage from '../components/SendMessage';


export default {
	name: 'connecter',
	components: {
		ReceivedMessage,
		SendMessage
	},
	mounted() {
		console.log("CONNECTER mounted")
		//this.$store.commit('INITIATE_CONNECT');

	},
	computed: {
		channelid() {
			return (this.$store.getters.channelid());
		},
		publickey() {
			return (this.$store.getters.publickey());
		}, 
		peerkey() {
			return (this.$store.getters.peerkey());
		},
		connected() {
			return (this.$store.getters.connected());
		}
	}
}
</script>
