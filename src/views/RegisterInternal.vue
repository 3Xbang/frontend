<!-- 
  RegisterInternal.vue
  Registration page for internal personnel
-->
<template>
  <div class="register-page">
    <!-- 品牌标志 -->
    <div class="logo-container">
      <img src="../assets/3xbang-logo.png" alt="3XBANG" class="logo" onerror="this.src='data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%22120%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%23ffd700%22%2F%3E%3Ctext%20x%3D%2260%22%20y%3D%2260%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20fill%3D%22%23333%22%3E3XBANG%3C%2Ftext%3E%3C%2Fsvg%3E'">
    </div>
    
    <div class="register-container">
      <div class="register-header">
        <h1>内部人员注册</h1>
        <p>创建您的内部账号以访问管理系统</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="avatar-upload">
          <div class="avatar-preview" @click="triggerFileInput">
            <img v-if="avatar" :src="avatarPreview" alt="Avatar Preview" />
            <div v-else class="avatar-placeholder">
              <span v-if="form.firstName && form.lastName">
                {{ form.firstName.charAt(0) }}{{ form.lastName.charAt(0) }}
              </span>
              <span v-else>
                <i class="fas fa-user"></i>
              </span>
            </div>
            <div class="avatar-overlay">
              <i class="fas fa-camera"></i>
            </div>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            @change="handleFileChange" 
            class="file-input"
          />
          <p class="avatar-hint">点击上传头像 (可选)</p>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">名字</label>
            <input 
              type="text" 
              id="firstName" 
              v-model="form.firstName" 
              placeholder="请输入名字"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="lastName">姓氏</label>
            <input 
              type="text" 
              id="lastName" 
              v-model="form.lastName" 
              placeholder="请输入姓氏"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            placeholder="请输入邮箱地址"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="phone">手机号码</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="form.phone" 
            placeholder="请输入手机号码"
          />
        </div>
        
        <!-- 社交账号区域 -->
        <div class="form-group">
          <label>社交账号 (可选)</label>
          <div class="social-account-container">
            <div class="social-type-select">
              <select v-model="form.socialType">
                <option value="facebook">Facebook</option>
                <option value="line">LINE</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="other">其他</option>
              </select>
            </div>
            <input 
              type="text" 
              v-model="form.socialAccount" 
              placeholder="请输入您的社交账号"
              class="social-input"
            />
          </div>
        </div>
        
        <!-- 添加部门和职位字段 -->
        <div class="form-row">
          <div class="form-group">
            <label for="department">部门</label>
            <input 
              type="text" 
              id="department" 
              v-model="form.department" 
              placeholder="请输入您的部门"
            />
          </div>
          
          <div class="form-group">
            <label for="position">职位</label>
            <input 
              type="text" 
              id="position" 
              v-model="form.position" 
              placeholder="请输入您的职位"
            />
          </div>
        </div>
        
        <!-- 权限级别选择器 -->
        <div class="form-group">
          <label for="permissionLevel">权限级别</label>
          <select 
            id="permissionLevel" 
            v-model="form.permissionLevel"
            class="permission-select"
            required
          >
            <option value="V1">V1 - 普通员工</option>
            <option value="admin">管理员</option>
          </select>
          <div class="permission-hint">普通员工只能使用基本功能，管理员可以访问所有系统功能</div>
        </div>
        
        <!-- 添加邀请码字段 -->
        <div class="form-group">
          <label for="inviteCode">邀请码</label>
          <input 
            type="text" 
            id="inviteCode" 
            v-model="form.inviteCode" 
            placeholder="请输入邀请码"
            required
          />
          <div class="permission-hint">请输入有效的邀请码，如果没有邀请码请联系管理员</div>
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            placeholder="请输入密码"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="passwordConfirm">确认密码</label>
          <input 
            type="password" 
            id="passwordConfirm" 
            v-model="form.passwordConfirm" 
            placeholder="请再次输入密码"
            required
          />
          <div class="error-text" v-if="passwordError">{{ passwordError }}</div>
        </div>
        
        <div class="form-group terms">
          <div class="checkbox-container">
            <input type="checkbox" id="terms" v-model="form.acceptTerms" required />
            <label for="terms">我已阅读并同意<a href="#" target="_blank">服务条款</a>和<a href="#" target="_blank">隐私政策</a></label>
          </div>
        </div>
        
        <div class="error-message" v-if="error">{{ error }}</div>
        
        <button 
          type="submit" 
          class="register-button" 
          :disabled="isLoading || !form.acceptTerms || !!passwordError"
        >
          {{ isLoading ? '注册中...' : '注 册' }}
        </button>
      </form>
      
      <div class="register-footer">
        <p>已有账号? <button @click="goToLogin" class="login-link text-button">登录</button></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'

// Component state
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  socialType: 'facebook', // 默认选择Facebook
  socialAccount: '',
  permissionLevel: 'V1', // 默认为普通员工权限
  password: '',
  passwordConfirm: '',
  acceptTerms: false,
  inviteCode: '',
  department: '',
  position: ''
})

const avatar = ref(null)
const avatarPreview = computed(() => {
  return avatar.value ? URL.createObjectURL(avatar.value) : null
})
const fileInput = ref(null)
const error = ref('')
const isLoading = ref(false)

// Computed properties
const passwordError = computed(() => {
  if (form.value.password && form.value.passwordConfirm && 
      form.value.password !== form.value.passwordConfirm) {
    return '两次输入的密码不一致'
  }
  return ''
})

// Hooks
const router = useRouter()
const userStore = useUserStore()

// Methods
const goToLogin = () => {
  router.push('/login')
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatar.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleRegister = async () => {
  try {
    // 重置错误信息
    error.value = ''
    
    // 检查密码确认
    if (form.value.password !== form.value.passwordConfirm) {
      error.value = '两次输入的密码不一致'
      return
    }
    
    // 检查邀请码是否正确
    if (!checkInviteCode()) {
      error.value = '邀请码无效，请联系管理员获取正确的邀请码'
      return
    }
    
    isLoading.value = true
    
    // 创建用户数据
    const userData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone,
      department: form.value.department,
      position: form.value.position,
      inviteCode: form.value.inviteCode,
      userType: 'internal', // 标记为内部人员
      avatar: avatar.value
    }
    
    console.log('Registering internal user:', userData)
    
    // 调用用户注册方法
    const result = await userStore.register(userData)
    
    if (result.success) {
      console.log('Registration successful, redirecting...')
      router.push('/login?registered=true')
    } else {
      error.value = result.error || '注册失败，请稍后再试'
    }
  } catch (err) {
    console.error('Registration error:', err)
    error.value = '发生意外错误，请稍后再试'
  } finally {
    isLoading.value = false
  }
}

/**
 * 检查邀请码是否有效
 * 目前使用简单的硬编码邀请码，后续可改为API验证
 * @returns {boolean} 邀请码是否有效
 */
const checkInviteCode = () => {
  // 有效的邀请码列表 - 实际应用中应从API获取或验证
  const validCodes = ['3XBANG2024', 'INTERNAL2024', 'EMPLOYEE2024'];
  return validCodes.includes(form.value.inviteCode)
}
</script>

<style scoped>
.register-page {
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

.register-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  padding: 30px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.register-header p {
  color: #666;
}

.register-form {
  display: flex;
  flex-direction: column;
}

/* 社交账号输入样式 */
.social-account-container {
  display: flex;
  gap: 10px;
}

.social-type-select {
  width: 30%;
}

.social-type-select select {
  height: 100%;
  width: 100%;
}

.social-input {
  flex: 1;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f0f0f0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  color: #666;
  font-size: 36px;
  font-weight: 600;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.file-input {
  display: none;
}

.avatar-hint {
  font-size: 14px;
  color: #666;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
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

.form-group input, 
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4096ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
}

.error-text {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 5px;
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.checkbox-container input {
  width: auto;
  margin-right: 10px;
}

.checkbox-container label {
  margin-bottom: 0;
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

.register-button {
  background-color: #4096ff;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.register-button:hover {
  background-color: #1677ff;
}

.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;
}

.login-link {
  color: #4096ff;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
  color: #1677ff;
}

/* 登录链接按钮样式，移除按钮默认样式 */
.text-button {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
}

/* 移动端适配 */
@media (max-width: 600px) {
  .register-container {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .social-account-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .social-type-select {
    width: 100%;
  }
  
  .form-group input {
    padding: 10px;
  }
  
  .register-button {
    padding: 12px;
  }
}

.permission-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.permission-select:focus {
  border-color: #3498db;
  outline: none;
}

.permission-hint {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 4px;
}
</style> 