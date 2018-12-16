<template>
<div>
	<v-container  grid-list-xs class="form">
		<v-layout row wrap>
			<v-flex xs3><div class="label">Password</div></v-flex>
			<v-flex xs6><div>{{passwordObfuscated}}</div></v-flex>
			<v-flex xs3><v-btn small color="blue darken-4" class="white--text button" v-clipboard="password">Copy</v-btn></v-flex>
			<v-flex xs3><div class="label">Message</div></v-flex>
			<v-flex xs6><div>{{message}}</div></v-flex>
			<v-flex xs3><v-btn small color="blue darken-4" class="white--text button" v-clipboard="message">Copy</v-btn></v-flex>
		</v-layout>
	</v-container>
	</div>
</template>
<style>
.form {
	text-align: left;
}
.label {
	text-align: left;
	font-weight: bold;
}
.data {
	text-align: left;
}
.button { 
	font-weight: bold;
}
</style>
<script>


export default {
	components : {
	},
	data() {
		return {
		};
	},
	mounted() {
	},
	computed: {
		login() {
			return this.$store.getters.login();
		},
		password() {
			return this.$store.getters.password();
		},
		passwordObfuscated() {
			if (this.$store.getters.password()!="") {
				return "******************";
			} else {
				return "";
			}
		},
		message() {
			return this.$store.getters.message();
		}
	}
}
</script>