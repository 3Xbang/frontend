/**
 * API客户端
 * 
 * 这个模块提供了一个用于与后端API通信的封装客户端。
 * 主要功能包括：
 * - 自动添加JWT令牌
 * - 统一错误处理
 * - 响应拦截器（处理登出等情况）
 */

import axios from 'axios';

/**
 * 环境配置
 */
const ENV = {
  // 检测是否为本地开发环境
  isDevelopment: process.env.NODE_ENV === 'development',
  // API基础URL
  apiUrls: {
    development: 'http://localhost:5173/api', // 本地开发环境
    production: 'http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173/api' // 部署环境
  }
};

/**
 * 获取基于当前环境的API基础URL
 * @returns {string} API基础URL
 */
const getApiBaseUrl = () => {
  // 根据环境返回对应的URL
  return ENV.isDevelopment 
    ? ENV.apiUrls.development 
    : ENV.apiUrls.production;
};

// 创建axios实例
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加JWT令牌到请求头
apiClient.interceptors.request.use(
  (config) => {
    // 从本地存储获取token
    const token = localStorage.getItem('auth_token');
    
    // 如果有token，则添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 提取错误信息
    const errorMsg = extractErrorMessage(error);
    
    // 处理401未授权错误，如令牌过期或无效
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token'); // 清除令牌
      localStorage.removeItem('user_info'); // 清除用户信息
      
      // 根据您的路由配置重定向到登录页面
      // 如果在Vue组件中，建议使用Vue Router的实例来处理导航
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject({ 
      ...error, 
      message: errorMsg
    });
  }
);

/**
 * 提取错误信息
 * @param {Error} error Axios错误对象
 * @returns {string} 增强的错误消息
 */
function extractErrorMessage(error) {
  if (error.response) {
    // 服务器返回了错误状态码
    const status = error.response.status;
    const responseData = error.response.data;
    
    // 如果服务器返回了详细的错误信息
    if (responseData && responseData.error) {
      return `${responseData.error.message || '未知错误'} (${status})`;
    }
    
    // 根据状态码返回通用错误消息
    switch (status) {
      case 400: return '请求参数错误 (400)';
      case 401: return '未授权，请重新登录 (401)';
      case 403: return '拒绝访问 (403)';
      case 404: return '请求的资源不存在 (404)';
      case 500: return '服务器内部错误 (500)';
      default: return `请求失败，状态码: ${status}`;
    }
  } else if (error.request) {
    // 请求已发送，但未收到响应
    return '无法连接到服务器，请检查网络连接';
  } else {
    // 设置请求时发生错误
    return error.message || '发送请求时出现错误';
  }
}

/**
 * API客户端
 */
export default {
  /**
   * API客户端实例
   * 提供直接访问底层axios实例的方式
   */
  client: apiClient,

  /**
   * 获取API基础URL
   * @returns {string} 当前API基础URL
   */
  getBaseUrl() {
    return getApiBaseUrl();
  },
  
  /**
   * 设置API基础URL
   * @param {string} url 新的API基础URL
   */
  setBaseUrl(url) {
    if (url && typeof url === 'string') {
      apiClient.defaults.baseURL = url;
      console.log('API基础URL已更新:', url);
    }
  },
  
  /**
   * 发送GET请求
   * @param {string} url 请求路径
   * @param {Object} params URL参数
   * @param {Object} config 请求配置
   * @returns {Promise} 请求Promise
   */
  async get(url, params = {}, config = {}) {
    return apiClient.get(url, { 
      params, 
      ...config 
    });
  },
  
  /**
   * 发送POST请求
   * @param {string} url 请求路径
   * @param {Object} data 请求数据
   * @param {Object} config 请求配置
   * @returns {Promise} 请求Promise
   */
  async post(url, data = {}, config = {}) {
    return apiClient.post(url, data, config);
  },
  
  /**
   * 发送PUT请求
   * @param {string} url 请求路径
   * @param {Object} data 请求数据
   * @param {Object} config 请求配置
   * @returns {Promise} 请求Promise
   */
  async put(url, data = {}, config = {}) {
    return apiClient.put(url, data, config);
  },
  
  /**
   * 发送DELETE请求
   * @param {string} url 请求路径
   * @param {Object} config 请求配置
   * @returns {Promise} 请求Promise
   */
  async delete(url, config = {}) {
    return apiClient.delete(url, config);
  },
  
  /**
   * 发送自定义请求
   * @param {Object} config 请求配置
   * @returns {Promise} 请求Promise
   */
  async request(config) {
    return apiClient.request(config);
  }
}; 