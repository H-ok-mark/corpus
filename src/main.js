import './assets/main.scss'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"

import router from '@/router'
import App from './App.vue'
import locale from 'element-plus/dist/locale/zh-cn.js'

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'

const app = createApp(App);
// const persist = createPersistedState();
// pinia.use(persist)
// app.use(pinia)
app.use(router);
app.use(ElementPlus, { locale })
app.mount('#app')
