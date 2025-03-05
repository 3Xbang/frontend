/**
 * User Store - Manages user authentication and user data
 * Uses Pinia for state management
 */

import { defineStore } from 'pinia'
import { reactive, readonly } from 'vue'
import { useRouter } from 'vue-router'

// 导入API服务
import { auth } from '@/frontend-integration'

// 建立一个全局状态对象
const state = reactive({
  isAuthenticated: false,
  userRole: null,
  userData: null,
  loading: false,
  error: null
})

// 为调试添加初始状态检查
console.log('UserStore - Initial state:', state)

export function useUserStore() {
  const router = useRouter()

  // 登录方法
  const login = async (credentials) => {
    console.log('Login attempt with:', credentials)
    state.loading = true
    state.error = null

    try {
      // 使用API服务进行登录
      const response = await auth.login(credentials)
      
      // API服务会自动存储令牌和用户数据
      const userData = auth.getCurrentUser()
      
      // 更新状态
      state.isAuthenticated = true
      state.userRole = userData.userRole
      state.userData = userData
      
      console.log('Login successful:', userData)
      console.log('Authentication state after login:', state.isAuthenticated)
      console.log('User role after login:', state.userRole)
      
      return { success: true, user: userData }
    } catch (error) {
      state.error = error.message
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      state.loading = false
    }
  }

  // 注册方法
  const register = async (userData) => {
    console.log('Register attempt with:', userData)
    state.loading = true
    state.error = null

    try {
      // 使用API服务进行注册
      const result = await auth.register(userData)
      console.log('Register result:', result)
      
      if (result.success) {
        return { success: true, message: result.message || '注册成功' }
      } else {
        // 设置状态中的错误信息，便于UI显示
        let errorMessage = '注册失败';
        
        // 从结果中提取详细错误信息
        if (typeof result.error === 'object' && result.error?.message) {
          errorMessage = result.error.message;
        } else if (result.message) {
          errorMessage = result.message;
        }
        
        state.error = errorMessage;
        
        return { 
          success: false, 
          error: errorMessage,
          details: result.error
        }
      }
    } catch (error) {
      const errorMessage = error.message || '注册失败，请稍后再试';
      state.error = errorMessage;
      console.error('Register error:', error)
      return { success: false, error: errorMessage }
    } finally {
      state.loading = false
    }
  }

  // 检查会话恢复方法
  const checkSession = async () => {
    console.log('Checking session')
    state.loading = true
    
    try {
      // 使用API服务检查会话
      if (auth.isAuthenticated()) {
        // 如果有本地令牌，尝试从服务器获取最新会话信息
        await auth.getSession()
        
        // 获取更新后的用户数据
        const userData = auth.getCurrentUser()
        
        // 更新状态
        state.isAuthenticated = true
        state.userRole = userData.userRole
        state.userData = userData
        
        console.log('Session restored:', userData)
        return true
      }
      return false
    } catch (error) {
      console.error('Session check error:', error)
      // 如果会话验证失败，清除状态
      logout()
      return false
    } finally {
      state.loading = false
    }
  }

  // 退出登录方法
  const logout = async () => {
    console.log('Logging out')
    state.loading = true
    
    try {
      // 使用API服务登出
      await auth.logout()
      
      // 清除状态
      state.isAuthenticated = false
      state.userRole = null
      state.userData = null
      
      // 重定向到主页
      if (router) {
        router.push('/')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      state.loading = false
    }
  }

  // 返回store接口
  return {
    // 状态（只读）
    get isAuthenticated() { return state.isAuthenticated },
    get userRole() { return state.userRole },
    get userData() { return state.userData },
    get loading() { return state.loading },
    get error() { return state.error },
    
    // 方法
    login,
    logout,
    checkSession,
    register
  }
} 