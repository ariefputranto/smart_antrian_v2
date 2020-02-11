// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'

// import VueRouter from 'vue-router'
// Vue.use(VueRouter)

import VueAxios from 'vue-axios'
import axios from 'axios'
Vue.use(VueAxios, axios)

// const router = new VueRouter({ mode: 'history' });
new Vue(Vue.util.extend({ router }, App)).$mount('#app');