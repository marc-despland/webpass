<template>
	<div class="home">
		<v-layout>
			<v-flex xs12 sm6 offset-sm3>
				<v-card color="light-blue lighten-4">
					<v-card-title primary-title class="cardtitle">
						<span>My Challenge</span>
					</v-card-title>
					<v-container fluid grid-list-xs>
						<v-layout row wrap >
							<v-flex d-flex xs12><span class="challenge">{{challenge}}</span></v-flex>
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