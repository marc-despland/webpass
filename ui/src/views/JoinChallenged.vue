<template>
	<div class="home">
		<v-container fluid grid-list-xs>
			<v-layout row wrap >
				<v-flex d-flex xs12>My Challenge is : {{challenge}}</v-flex>
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
			channel: ""
		};
	},
	methods: {
	},
	mounted() {
	},
	computed: {
		challenge() {
			return (this.$store.getters.challenge());
		}
	}
}
</script>