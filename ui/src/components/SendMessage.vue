<template>
	<v-container fluid grid-list-xs>
		<v-layout row wrap >
			<v-flex d-flex xs12><v-text-field v-model="login" label="Login" required></v-text-field></v-flex>
			<v-flex d-flex xs12><v-text-field v-model="password" label="Password" type="password" required></v-text-field></v-flex>
			<v-flex d-flex xs12><v-textarea name="message" type="password" v-model="message" label="Message" required></v-textarea></v-flex>
			<v-flex d-flex xs12><v-btn color="info" @click="send()">Send to peer</v-btn></v-flex>
		</v-layout>
	</v-container>
</template>
<style>
.label {
	text-align: left;
	font-weight: bold;
}
</style>
<script>

export default {
	components : {
	},
	data() {
		return {
			login : "",
			password: "",
			message: ""
		};
	},
	methods: {
		send() {
			var info={
				login: this.login,
				password: this.password,
				message: this.message
			};
			this.$store.dispatch('SEND_MESSAGE',info);
			this.login="";
			this.password="";
			this.message="";
		}

	},
	mounted() {
	},
	computed: {
	}
}
</script>