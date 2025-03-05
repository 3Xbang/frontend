<template>
  <div class="client-login-container">
    <div class="login-card">
      <div class="logo-container">
        <img src="../assets/logo.png" alt="3XBANG建筑公司" class="logo" />
        <h1 class="company-name">3XBANG建筑公司</h1>
      </div>
      
      <h2 class="login-title">客户工作平台</h2>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">客户邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="loginForm.email" 
            placeholder="请输入注册邮箱"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="loginForm.password" 
            placeholder="请输入密码"
            required
          />
        </div>
        
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="loginForm.remember" />
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password" @click.prevent="forgotPassword">忘记密码？</a>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>还没有账号？请联系您的项目经理获取登录信息</p>
        <p class="contact-info">联系电话：555-123-4567</p>
      </div>
    </div>
    
    <div class="login-info">
      <h2>客户工作平台功能</h2>
      <ul>
        <li><span class="feature-icon">📊</span> 实时查看项目进度</li>
        <li><span class="feature-icon">🔧</span> 临时工作管理</li>
        <li><span class="feature-icon">🛠️</span> 在线报修服务</li>
        <li><span class="feature-icon">📝</span> 报价单在线确认</li>
        <li><span class="feature-icon">📃</span> 收据电子签收</li>
      </ul>
      <p class="platform-intro">我们致力于为您提供透明、高效的项目管理体验</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';

export default {
  name: 'ClientLogin',
  
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    
    const loginForm = reactive({
      email: '',
      password: '',
      remember: false
    });
    
    const isLoading = ref(false);
    const errorMessage = ref('');
    
    const handleLogin = async () => {
      try {
        isLoading.value = true;
        errorMessage.value = '';
        
        // 在实际项目中，这里应该调用API进行登录验证
        // 以下是模拟登录的示例代码
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (loginForm.email === 'client@example.com' && loginForm.password === 'password') {
          // 存储用户信息
          userStore.setUser({
            id: 'client-123',
            name: '测试客户',
            role: 'client',
            email: loginForm.email
          });
          
          // 重定向到客户工作流程页面
          router.push('/client/workflow');
        } else {
          errorMessage.value = '邮箱或密码不正确，请重试';
        }
      } catch (error) {
        console.error('登录出错:', error);
        errorMessage.value = '登录失败，请稍后再试';
      } finally {
        isLoading.value = false;
      }
    };
    
    const forgotPassword = () => {
      alert('请联系您的项目经理重置密码');
    };
    
    return {
      loginForm,
      isLoading,
      errorMessage,
      handleLogin,
      forgotPassword
    };
  }
}
</script>

<style scoped>
.client-login-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  flex: 1;
  max-width: 450px;
  padding: 3rem 2rem;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.login-info {
  flex: 1;
  background-color: #2c3e50;
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  width: 60px;
  height: 60px;
  margin-right: 1rem;
}

.company-name {
  font-size: 1.8rem;
  margin: 0;
  color: #2c3e50;
}

.login-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #3498db;
  text-align: center;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 1rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-me input {
  margin-right: 0.5rem;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.form-actions {
  margin-bottom: 1rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #2980b9;
}

.login-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-top: 1rem;
}

.login-footer {
  margin-top: auto;
  text-align: center;
  color: #7f8c8d;
}

.contact-info {
  font-weight: 600;
  color: #2c3e50;
}

.login-info h2 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #3498db;
}

.login-info ul {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.login-info li {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.feature-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.platform-intro {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #bdc3c7;
}

@media (max-width: 768px) {
  .client-login-container {
    flex-direction: column;
  }
  
  .login-card {
    max-width: 100%;
  }
  
  .login-info {
    padding: 2rem;
  }
}
</style> 