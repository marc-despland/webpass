import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueNativeSock from 'vue-native-websocket'
import VueClipboards from 'vue-clipboards';


//const url = "wss://webpass.kmt.orange.com/api/socket"
const url= "ws://172.17.0.2:8080/api/socket"
//var dataws = new WebSocket(url) , WebSocket: dataws
Vue.use(VueNativeSock, url, { store: store, connectManually: true})
Vue.use(VueClipboards);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
