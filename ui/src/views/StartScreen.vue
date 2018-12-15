<template>
	<div class="home">
		<v-container fluid grid-list-xs>
			<v-layout row wrap >
				<v-flex d-flex xs12><v-btn color="success" @click="listen()">Listen for connection</v-btn></v-flex>
				<v-flex d-flex xs12><v-btn color="success" @click="join()">Join another peer</v-btn></v-flex>
			</v-layout>
		</v-container>
	</div>
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
		};
	},
	methods: {
		listen() {
			this.$store.dispatch('LISTEN');
		},
		join() {
			this.$store.dispatch('JOIN');
		}

	},
	mounted() {
	},
	computed: {
	}
}
</script>