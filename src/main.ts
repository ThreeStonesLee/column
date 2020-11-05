import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:9090'
axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, msg: config.data })
  return config
})
// console.log(localStorage.getItem('token'))
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  // console.log(config)
  if (+config.data.code === 1) {
    store.commit('setError', { status: true, msg: config.data })
  }
  return config
}, (err) => {
  console.log(err)
})

const app = createApp(App)
app.config.globalProperties.$axios = axios
app.config.globalProperties.foo = 'bar'
app.use(router)
app.use(store)
// app.config.performance = true
app.mount('#app')
