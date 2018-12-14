import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Listener from './views/Listener.vue'
import Connecter from './views/Connecter.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/listen',
      name: 'listener',
      component: Listener
    },
    {
      path: '/connect',
      name: 'connecter',
      component: Connecter
    }
  ]
})
