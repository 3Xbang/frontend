<!-- 
  Login.vue
  Authentication page for users to login to the system
-->
<template>
  <div class="login-page">
    <!-- 品牌标志 -->
    <div class="logo-container">
      <img src="../assets/3xbang-logo.png" alt="3XBANG" class="logo" onerror="this.src='data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%22120%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%23ffd700%22%2F%3E%3Ctext%20x%3D%2260%22%20y%3D%2260%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20fill%3D%22%23333%22%3E3XBANG%3C%2Ftext%3E%3C%2Fsvg%3E'">
    </div>
    
    <div class="login-container">
      <div class="login-header">
        <h1>登录</h1>
        <p>欢迎回来，请登录您的账号</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">邮箱/手机号</label>
          <input 
            type="text" 
            id="email" 
            v-model="email" 
            placeholder="请输入邮箱或手机号"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="请输入密码"
            required
          />
        </div>
        
        <div class="form-options">
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="rememberMe" />
            <label for="remember">记住我</label>
          </div>
          <a href="#" class="forgot-password">忘记密码?</a>
        </div>
        
        <div class="error-message" v-if="error">{{ error }}</div>
        
        <button 
          type="submit" 
          class="login-button" 
          :disabled="isLoading"
        >
          {{ isLoading ? '登录中...' : '登 录' }}
        </button>
      </form>
      
      <div class="login-footer">
        <p>还没有账号? 
          <router-link to="/register/internal" class="register-link">内部人员注册</router-link> | 
          <router-link to="/register/client" class="register-link">客户注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'

// Component state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')
const isLoading = ref(false)

// Hooks
const router = useRouter()
const userStore = useUserStore()

// Lifecycle hooks
onMounted(() => {
  console.log('Login component mounted')
})

// Methods
const handleLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    console.log('Logging in with:', email.value);
    
    // 添加一些默认账号以便测试
    if (email.value === '') {
      if (document.referrer && document.referrer.includes('/client')) {
        email.value = 'client@example.com'
        password.value = 'client123'
      } else {
        email.value = 'staff@3xbang.com'
        password.value = 'staff123'
      }
    }
    
    // Call the store action to perform login
    const result = await userStore.login({
      email: email.value,
      password: password.value
    })
    
    if (result.success) {
      console.log('Login successful, redirecting...');
      console.log('User role:', userStore.userRole);
      
      // Determine where to redirect based on user role
      if (userStore.userRole === 'admin') {
        router.push('/admin/dashboard');
      } else if (userStore.userRole === 'staff') {
        router.push('/internal/workspace');
      } else if (userStore.userRole === 'client') {
        router.push('/client/workflow');
      } else {
        router.push('/');
      }
    } else {
      error.value = result.error || '登录失败，请检查账号和密码'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = '发生意外错误，请稍后再试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: #e6f7ff;
  padding: 20px;
}

.logo-container {
  margin-bottom: 20px;
  text-align: center;
}

.logo {
  width: 320px;
  height: auto;
  max-width: 100%;
}

.login-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 30px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #4096ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
}

.forgot-password {
  color: #4096ff;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
  color: #1677ff;
}

.error-message {
  color: #ff4d4f;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
  padding: 8px;
  background-color: #fff2f0;
  border-radius: 4px;
}

.login-button {
  background-color: #4096ff;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #1677ff;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;
}

.register-link {
  color: #4096ff;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
  color: #1677ff;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .login-container {
    padding: 20px;
  }
  
  .form-group input {
    padding: 10px;
  }
  
  .login-button {
    padding: 12px;
  }
}
</style> 