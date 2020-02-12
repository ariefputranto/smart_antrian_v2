// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router/route.js'

import VueAxios from 'vue-axios'
import axios from 'axios'
Vue.use(VueAxios, axios)

new Vue(Vue.util.extend({ router }, App)).$mount('#app');