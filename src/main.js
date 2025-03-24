import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 確保有引入 router

const app = createApp(App)

app.use(router) // 確保 Vue 使用 router
app.mount('#app')
