/**
 * 后端API连接测试脚本
 * 测试连接到http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173
 */

import axios from 'axios';

const API_URL = 'http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173';

console.log(`正在测试连接到后端: ${API_URL}`);

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
});

// 测试连接
async function testConnection() {
  try {
    // 测试基本连接
    console.log('尝试连接到后端服务器...');
    const response = await api.get('/');
    console.log('连接成功! 状态码:', response.status);
    console.log('响应类型:', response.headers['content-type']);
    
    // 测试login API
    try {
      console.log('\n尝试测试登录API...');
      // 尝试不同的账号
      const accounts = [
        { email: 'admin@3xbang.com', password: 'admin123' },
        { email: 'client@example.com', password: 'client123' },
        { email: 'staff@3xbang.com', password: 'staff123' }
      ];
      
      console.log('尝试使用多个测试账号登录...');
      
      for (const account of accounts) {
        try {
          console.log(`\n尝试账号: ${account.email}`);
          const loginResponse = await api.post('/api/auth/login', account);
          console.log('登录API响应状态码:', loginResponse.status);
          console.log('登录成功! 获取到令牌:', !!loginResponse.data.token);
          if (loginResponse.data.token) {
            console.log('令牌前缀:', loginResponse.data.token.substring(0, 10) + '...');
          }
          console.log('响应数据:', JSON.stringify(loginResponse.data, null, 2));
          // 找到有效账号后终止循环
          break;
        } catch (error) {
          console.log(`账号 ${account.email} 登录失败:`, error.response?.data?.error?.message || error.message);
        }
      }
    } catch (error) {
      console.error('登录API测试过程出错:', error.message);
    }
    
  } catch (error) {
    console.error('连接失败:', error.message);
    if (error.response) {
      console.log('服务器响应状态码:', error.response.status);
    } else if (error.request) {
      console.log('没有收到响应，请检查服务器是否运行');
    }
  }
}

// 运行测试
testConnection()
  .then(() => console.log('测试完成'))
  .catch(err => console.error('测试过程中发生错误:', err)); 