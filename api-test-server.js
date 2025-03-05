/**
 * 3XBANG建筑公司 - API测试服务器
 * 
 * 这个简单的服务器用于托管API浏览器测试页面，
 * 它允许在浏览器中直接测试API功能。
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建Express应用
const app = express();
const port = 8081;

// 启用CORS以允许API调用
app.use(cors());

// 托管静态HTML文件
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'api-browser-test.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`API测试服务器已启动: http://localhost:${port}`);
  console.log('请在浏览器中访问上述地址来测试API功能');
}); 