import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueNativeSock from 'vue-native-websocket'

const url = "ws://webpass.kmt.orange.com/api/socket"
var dataws = new WebSocket(url)
Vue.use(VueNativeSock, url, { store: store, WebSocket: dataws ,reconnection: true, reconnectionAttempts: 10, reconnectionDelay: 1000})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
