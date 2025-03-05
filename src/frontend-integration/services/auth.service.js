/**
 * 认证服务
 *
 * 提供用户认证与授权相关功能：
 * - 登录/登出
 * - 会话管理
 * - 用户信息获取
 * - 权限检查
 */

import api from '../api';

/**
 * 将用户信息和令牌存储到本地存储
 * @param {Object} userData 用户数据对象
 * @param {string} token JWT令牌
 */
const saveUserData = (userData, token) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', token);
};

/**
 * 清除用户会话数据
 */
const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export default {
  /**
   * 用户注册
   * 
   * @param {Object} userData 用户数据
   * @param {string} userData.firstName 名字
   * @param {string} userData.lastName 姓氏
   * @param {string} userData.email 电子邮箱
   * @param {string} userData.password 密码
   * @param {string} userData.userType 用户类型(client/employee/admin)
   * @param {string} [userData.phone] 电话号码
   * @param {string} [userData.company] 公司名称
   * @param {string} [userData.location] 地址
   * @param {string} [userData.socialType] 社交媒体类型
   * @param {string} [userData.socialAccount] 社交媒体账号
   * @param {string} [userData.avatar] 头像(base64或URL)
   * @returns {Promise<Object>} 包含成功状态和消息的对象
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { data } = response;
      
      // 如果API返回success字段，则使用API返回的成功状态
      if (data && typeof data.success !== 'undefined') {
        if (data.success) {
          return {
            success: true,
            message: data.message || '注册成功',
            data: data
          };
        } else {
          // API明确返回了失败状态
          return {
            success: false,
            message: data.error?.message || data.message || '注册失败',
            error: data.error || data.message || '未知错误'
          };
        }
      }
      
      // 如果API没有明确返回success字段，则假定成功
      return {
        success: true,
        message: data.message || '注册成功',
        data: data
      };
    } catch (error) {
      console.error('注册失败:', error);
      
      // 尝试从响应中提取错误信息
      let errorMessage = '注册失败，请稍后再试';
      let errorData = error;
      
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        if (responseData.error && responseData.error.message) {
          errorMessage = responseData.error.message;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
        
        errorData = responseData.error || responseData;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: errorData
      };
    }
  },

  /**
   * 用户登录
   * 
   * @param {Object} credentials 用户凭据
   * @param {string} credentials.email 用户电子邮箱 (必须是完整的电子邮箱地址，例如：user@repair-system.com)
   * @param {string} credentials.password 用户密码
   * @returns {Promise<Object>} 包含用户信息和令牌的对象
   * 
   * 注意: 后端要求使用完整的电子邮箱地址格式。
   * 
   * 示例有效账号:
   * - 管理员账号: admin@repair-system.com / admin123
   * - 客户账号: client@repair-system.com / client123
   * - 员工账号: employee@repair-system.com / employee123
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { data } = response;
      
      if (data.token && data.user) {
        saveUserData(data.user, data.token);
      }
      
      return data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },
  
  /**
   * 用户登出
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      // 即使API请求失败，也清除本地存储
      clearUserData();
    }
  },
  
  /**
   * 获取当前会话
   * @returns {Promise<Object>} 用户信息
   */
  async getSession() {
    try {
      const response = await api.get('/auth/check-session');
      const { data } = response;
      
      if (data.user) {
        saveUserData(data.user, localStorage.getItem('token'));
      }
      
      return data;
    } catch (error) {
      console.error('获取会话信息失败:', error);
      clearUserData();
      throw error;
    }
  },
  
  /**
   * 检查用户是否已认证
   * @returns {boolean} 是否已认证
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  /**
   * 获取当前用户信息
   * @returns {Object|null} 用户信息或null
   */
  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  /**
   * 检查当前用户是否具有指定角色
   * @param {string|string[]} roles 要检查的角色或角色数组
   * @returns {boolean} 用户是否具有指定角色
   */
  hasRole(roles) {
    const user = this.getCurrentUser();
    
    if (!user || !user.role) {
      return false;
    }
    
    // 如果传入的是字符串，转换为数组
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    return roleArray.includes(user.role);
  },
  
  /**
   * 检查当前用户是否是管理员
   * @returns {boolean} 是否是管理员
   */
  isAdmin() {
    return this.hasRole('admin');
  },
  
  /**
   * 检查当前用户是否是客户
   * @returns {boolean} 是否是客户
   */
  isClient() {
    return this.hasRole('client');
  },
  
  /**
   * 检查当前用户是否是员工
   * @returns {boolean} 是否是员工
   */
  isEmployee() {
    return this.hasRole(['employee', 'manager', 'admin']);
  }
}; 