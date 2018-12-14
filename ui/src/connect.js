/* eslint-disable */
const ConnectPlugin = store => {
	// called when the store is initialized
	store.subscribe((mutation, state) => {
		console.log("Subscribe !!!!!!!!!!!!!!!")
		console.log(mutation.type)
		console.log(mutation.payload)
	})
}

