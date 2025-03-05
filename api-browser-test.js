/**
 * 模拟浏览器环境的API测试脚本
 * 使用axios直接测试API连接
 */

import axios from 'axios';

console.log('正在测试API连接（模拟浏览器环境）...');

// 创建axios实例
const api = axios.create({
  baseURL: 'http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// 测试不同的API路径
async function testApiPaths() {
  const paths = [
    '/api/auth/login',
    '/api/login',
    '/auth/login',
    '/login',
    '/api/client/projects',
    '/client/projects',
    '/projects'
  ];
  
  console.log('测试不同的API路径...');
  
  for (const path of paths) {
    try {
      console.log(`尝试访问: ${path}`);
      const response = await api.get(path);
      console.log(`路径 ${path} 响应状态码:`, response.status);
      console.log(`路径 ${path} 响应类型:`, response.headers['content-type']);
      console.log(`路径 ${path} 测试结果: 可访问 ✅`);
    } catch (error) {
      console.log(`路径 ${path} 错误:`, error.message);
    }
    console.log('-------------------');
  }
}

// 执行测试
async function runTests() {
  await testApiPaths();
  console.log('API路径测试完成');
}

runTests().catch(error => {
  console.error('测试执行错误:', error);
}); 