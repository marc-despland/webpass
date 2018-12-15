<template>
	<div class="home">
		<v-container fluid grid-list-xs>
			<v-layout row wrap >
				<v-flex d-flex xs12><v-text-field v-model="channel" label="Channel" required></v-text-field></v-flex>
				<v-flex d-flex xs12><v-text-field v-model="challenge" label="Challenge" required></v-text-field></v-flex>
				<v-flex d-flex xs12><v-btn color="success" @click="join()">Join</v-btn></v-flex>
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
			channel: "",
			challenge: ""
		};
	},
	methods: {
		join() {
			var options= {
				channel: this.channel,
				challenge: this.challenge
			}
			this.$store.dispatch('JOIN_REQUEST', options);
		}

	},
	mounted() {
	},
	computed: {
	}
}
</script>