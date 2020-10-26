import Vue from 'vue'
import VueRouter from 'vue-router'
import { createClient } from '@supabase/supabase-js'

import App from './App.vue'
import Login from './views/Login'
import Room from './views/Room'

import './assets/styles/index.css';

Vue.config.productionTip = false
Vue.use(VueRouter)

Vue.prototype.$supabase = createClient(
  "https://xdkpruanjhtyqpimwvmt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMzMwMzc4NywiZXhwIjoxOTE4ODc5Nzg3fQ.O1u-DkLlqtbLih9aO2K7OynQklqefeOpM-nBCA4B_yM"
);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/room',
      name: 'Room',
      component: Room,
    },
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('sb-mog') && localStorage.getItem('supabase.auth.token')
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
