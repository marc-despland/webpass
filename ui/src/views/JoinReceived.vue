<template>
	<div class="home">
		<v-layout>
			<v-flex xs12 sm6 offset-sm3>
				<v-card color="light-blue lighten-4">
					<v-card-title primary-title class="cardtitle">
						<span>Peer Challenge</span>
					</v-card-title>
					<v-container fluid grid-list-xs>
						<v-layout row wrap >
							<v-flex d-flex xs12><v-text-field type="number" v-model="challenge" label="Challenge" required></v-text-field></v-flex>
							<v-flex d-flex xs12><v-btn color="blue darken-4" class="white--text button" @click="join()">Join</v-btn></v-flex>
						</v-layout>
					</v-container>
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

export default {
	components : {
	},
	data() {
		return {
			challenge: ""
		};
	},
	methods: {
		join() {
			this.$store.dispatch('JOIN_CHALLENGE', this.challenge);
		}

	},
	mounted() {
	},
	computed: {
	}
}
</script>