import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ListaSladoleda from './components/lista-sladoleda/ListaSladoleda.vue'
import LandingPage from './views/LandingPage.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/sladoledi', component: ListaSladoleda },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(vuetify).use(router).mount('#app')
