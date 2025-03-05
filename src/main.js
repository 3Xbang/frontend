/**
 * Main entry point for the construction company web application
 * Initializes Vue with all necessary plugins
 */

// Import styles
import './assets/main.css'

// Import frameworks and plugins
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Import app and configurations
import App from './App.vue'
import router from './router'

// Import API services
import { api } from './frontend-integration'

// 配置API基础URL
const apiUrl = import.meta.env.VITE_API_URL || 'https://ytdyeelcjbdb.sealoshzh.site/api'
// 设置API基础URL
if (api && api.client) {
  // 优先使用client属性设置baseURL
  api.client.defaults.baseURL = apiUrl;
  console.log('通过client属性设置API基础URL:', apiUrl);
} else if (typeof api.setBaseUrl === 'function') {
  // 其次使用setBaseUrl方法
  api.setBaseUrl(apiUrl);
  console.log('通过setBaseUrl方法设置API基础URL:', apiUrl);
} else {
  console.error('API客户端结构异常，无法设置基础URL');
}

// Create the Pinia instance
const pinia = createPinia()

// Create the Vue application
const app = createApp(App)

// Register plugins
app.use(pinia)
app.use(router)

// For debugging - expose app globally
window.vueApp = app

// Mount the app
app.mount('#app')

// Log for debugging
console.log('App initialized')

// 在Vue实例创建后初始化用户认证
import { useUserStore } from './store/userStore'
const userStore = useUserStore()
userStore.checkSession()
