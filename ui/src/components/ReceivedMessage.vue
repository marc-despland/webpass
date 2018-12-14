<template>
<div>
	<v-container  grid-list-md class="form">
		<v-layout row wrap>
			<v-flex md4><div class="label">Login</div></v-flex>
			<v-flex md8><div>{{login}}</div></v-flex>
		</v-layout>
		<v-layout row wrap>	
			<v-flex md4><div class="label">Password</div></v-flex>
			<v-flex md8><div>{{password}}</div></v-flex>
		</v-layout>
		<v-layout row wrap>	
			<v-flex md4><div class="label">Message</div></v-flex>
			<v-flex md8><div>{{message}}</div></v-flex>
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
		message() {
			return this.$store.getters.message();
		}
	}
}
</script>