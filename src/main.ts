import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { store, key } from './store/weather'
import './assets/styles/app.css'

const app = createApp(App)

app.use(router)
app.use(store, key)

let baseURL = 'https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5'
// let baseURL = 'https://api.openweathermap.org/data/2.5'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
axios.defaults.baseURL = app.config.globalProperties.publicPath = baseURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

app.mount('#app')
