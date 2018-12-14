<template>
	<div>
		<ReceivedMessage/>
		<SendMessage/>
	</div>
</template>

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
