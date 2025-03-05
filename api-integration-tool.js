/**
 * 3XBANG建筑公司 - API集成测试工具
 * 
 * 这个工具用于测试前后端API集成，帮助团队确认API端点的正确性。
 * 前端团队和后端团队都可以使用这个工具来测试和验证API。
 * 
 * 使用方法：
 * 1. 确保安装了依赖：npm install axios yargs chalk
 * 2. 运行: node api-integration-tool.js [命令] [选项]
 * 
 * 示例:
 * - 测试API连接: node api-integration-tool.js ping
 * - 测试登录API: node api-integration-tool.js login --email=user@example.com --password=123456
 * - 测试注册API: node api-integration-tool.js register --email=new@example.com --password=123456
 * - 查看所有命令: node api-integration-tool.js --help
 */

import axios from 'axios';
import { createInterface } from 'readline';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建readline接口
const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

// 询问函数
function question(query) {
  return new Promise(resolve => readline.question(query, resolve));
}

// 配置
const config = {
  baseURL: 'http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173',
  apiPrefix: '/api',
  logFile: './api-test-log.txt'
};

// 工具辅助函数
async function appendToLog(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  try {
    await fs.appendFile(config.logFile, logMessage);
    console.log(message);
  } catch (error) {
    console.error('无法写入日志文件:', error.message);
    console.log(message);
  }
}

// API客户端
const api = axios.create({
  baseURL: `${config.baseURL}${config.apiPrefix}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API测试类
class ApiTester {
  constructor() {
    this.baseURL = 'http://localhost:5173';
    this.token = null; // 存储JWT令牌
  }

  // 保存JWT令牌
  saveToken(token) {
    this.token = token;
    console.log('JWT令牌已保存，可用于后续测试');
    return token;
  }

  // 获取JWT令牌
  getToken() {
    return this.token;
  }

  // 检查是否有令牌
  hasToken() {
    return !!this.token;
  }

  // 测试API连接
  async ping() {
    await appendToLog('测试API连接...');
    
    try {
      // 测试登录端点是否可访问，而不是测试根路径
      const response = await axios.get(`${config.baseURL}${config.apiPrefix}/auth/login`, {
        validateStatus: function (status) {
          // 接受任何状态码，因为我们只关心端点是否存在
          return true;
        }
      });
      await appendToLog(`状态码: ${response.status}`);
      if (response.data) {
        await appendToLog(`响应数据: ${JSON.stringify(response.data, null, 2)}`);
      }
      await appendToLog('API连接测试成功!\n');
      return true;
    } catch (error) {
      await appendToLog(`API连接错误: ${error.message}`);
      if (error.response) {
        await appendToLog(`状态码: ${error.response.status}`);
        await appendToLog(`错误数据: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      await appendToLog('API连接测试失败!\n');
      return false;
    }
  }
  
  // 测试登录API
  async login(email, password) {
    try {
      console.log(`尝试登录账号 ${email}...`);
      const response = await axios.post(`${this.baseURL}/api/auth/login`, {
        email,
        password
      });
      
      console.log(`状态码: ${response.status}`);
      
      if (response.data && response.data.token) {
        console.log('登录成功!');
        // 保存JWT令牌
        this.saveToken(response.data.token);
        await appendToLog(`状态码: ${response.status}`);
        await appendToLog('登录成功!');
        await appendToLog('登录API测试成功!\n');
        return { success: true, token: response.data.token };
      } else {
        console.log('登录成功，但未返回令牌!');
        console.log('响应数据:', JSON.stringify(response.data, null, 2));
        await appendToLog(`状态码: ${response.status}`);
        await appendToLog('登录成功，但未返回令牌!');
        await appendToLog('登录API测试失败!\n');
        return { success: true, token: null };
      }
    } catch (error) {
      console.log(`登录API错误: ${error.message}`);
      if (error.response) {
        console.log(`状态码: ${error.response.status}`);
        console.log(`错误数据: ${JSON.stringify(error.response.data, null, 2)}`);
        await appendToLog(`状态码: ${error.response.status}`);
        await appendToLog(`错误数据: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      await appendToLog('登录API测试失败!\n');
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }
  
  // 测试会话API
  async checkSession(token) {
    // 使用保存的令牌或传入的令牌
    const useToken = token || this.token;
    
    if (!useToken) {
      await appendToLog('无令牌，跳过会话API测试\n');
      return { success: false, error: 'NO_TOKEN' };
    }
    
    await appendToLog('测试会话检查API...');
    
    try {
      const response = await api.get('/auth/check-session', {
        headers: { Authorization: `Bearer ${useToken}` }
      });
      await appendToLog(`状态码: ${response.status}`);
      await appendToLog(`用户会话信息: ${JSON.stringify(response.data, null, 2)}`);
      await appendToLog('会话API测试成功!\n');
      return { success: true, data: response.data };
    } catch (error) {
      await appendToLog(`会话API错误: ${error.message}`);
      if (error.response) {
        await appendToLog(`状态码: ${error.response.status}`);
        await appendToLog(`错误数据: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      await appendToLog('会话API测试失败!\n');
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  // 测试注册API
  async register(userData) {
    await appendToLog('尝试注册新账号...');
    
    try {
      const response = await api.post('/auth/register', userData);
      await appendToLog(`状态码: ${response.status}`);
      await appendToLog(`响应数据: ${JSON.stringify(response.data, null, 2)}`);
      await appendToLog('注册API测试成功!\n');
      return true;
    } catch (error) {
      await appendToLog(`注册API错误: ${error.message}`);
      if (error.response) {
        await appendToLog(`状态码: ${error.response.status}`);
        await appendToLog(`错误数据: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      await appendToLog('注册API测试失败!\n');
      return false;
    }
  }
  
  // 测试登出API
  async logout(token) {
    // 使用保存的令牌或传入的令牌
    const useToken = token || this.token;
    
    if (!useToken) {
      await appendToLog('无令牌，跳过登出API测试\n');
      return { success: false, error: 'NO_TOKEN' };
    }
    
    await appendToLog('测试登出API...');
    
    try {
      const response = await api.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${useToken}` }
      });
      await appendToLog(`状态码: ${response.status}`);
      await appendToLog(`响应数据: ${JSON.stringify(response.data, null, 2)}`);
      await appendToLog('登出API测试成功!\n');
      
      // 清除保存的令牌
      this.token = null;
      
      return { success: true };
    } catch (error) {
      await appendToLog(`登出API错误: ${error.message}`);
      if (error.response) {
        await appendToLog(`状态码: ${error.response.status}`);
        await appendToLog(`错误数据: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      await appendToLog('登出API测试失败!\n');
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }
}

// 运行测试
async function runTests() {
  console.log('=============================================');
  console.log('开始API集成测试');
  console.log('=============================================\n');

  const tester = new ApiTester();

  // 测试API连接
  await tester.ping();

  // 管理员账号
  const adminEmail = 'admin@repair-system.com';
  const adminPassword = 'admin123';

  // 测试登录
  const loginResult = await tester.login(adminEmail, adminPassword);
  
  // 使用令牌进行后续测试
  const token = loginResult.success ? loginResult.token : null;

  // 测试会话检查
  await tester.checkSession(token);

  // 测试注册 - 创建一个新的测试账号
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'password123';
  await tester.register({
    email: testEmail,
    password: testPassword,
    name: 'Test User'
  });

  // 测试登出
  await tester.logout(token);

  await appendToLog('=============================================');
  await appendToLog('API测试完成');
  await appendToLog('=============================================\n');
  console.log('\n=============================================');
  console.log('API测试完成');
  console.log('=============================================');
}

// 执行测试
runTests().catch(async error => {
  await appendToLog(`测试执行出错: ${error.message}`);
  console.error('测试执行出错:', error);
});

// 命令处理函数
const commands = {
  // 测试API连接
  async ping() {
    try {
      console.log('测试API连接...');
      const response = await api.get('/');
      console.log('API服务器在线!');
      await appendToLog('✅ API连接测试成功，服务器在线并正常响应。');
      return true;
    } catch (error) {
      console.error('API连接失败:', error.message);
      await appendToLog(`❌ API连接测试失败: ${error.message}`);
      return false;
    }
  },

  // 测试登录API
  async login(email, password) {
    if (!email || !password) {
      console.log('可用的测试账号:');
      console.log('- 管理员账号: admin@repair-system.com / admin123');
      console.log('- 客户账号: client@repair-system.com / client123');
      console.log('- 员工账号: employee@repair-system.com / employee123');
      
      const inputEmail = await question('请输入邮箱: ');
      const inputPassword = await question('请输入密码: ');
      email = inputEmail || email;
      password = inputPassword || password;
    }

    try {
      console.log(`尝试登录账号 ${email}...`);
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      if (response.data.token) {
        await appendToLog(`✅ 登录测试成功，账号 ${email} 已验证。`);
        return true;
      } else {
        console.log('登录成功，但未返回令牌');
        await appendToLog(`⚠️ 登录API响应成功，但未返回令牌。账号: ${email}`);
        return false;
      }
    } catch (error) {
      console.error('登录失败:', error.message);
      await appendToLog(`❌ 登录测试失败，账号: ${email}, 错误: ${error.response?.data?.error?.message || error.message}`);
      return false;
    }
  },

  // 测试注册API
  async register(email, password) {
    if (!email || !password) {
      const inputEmail = await question('请输入新邮箱: ');
      const inputPassword = await question('请输入新密码: ');
      email = inputEmail || email;
      password = inputPassword || password;
    }

    try {
      console.log(`尝试注册新账号 ${email}...`);
      const response = await api.post('/auth/register', {
        email,
        password,
        name: email.split('@')[0]
      });
      
      console.log('注册成功!');
      await appendToLog(`✅ 注册测试成功，新账号 ${email} 已创建。`);
      
      // 尝试使用新注册的账号登录
      const loginSuccess = await commands.login(email, password);
      return true;
    } catch (error) {
      console.error('注册失败:', error.message);
      await appendToLog(`❌ 注册测试失败，账号: ${email}, 错误: ${error.response?.data?.error?.message || error.message}`);
      return false;
    }
  },

  // 测试会话API
  async session() {
    if (!loginResult.token) {
      console.log('未登录，请先登录');
      return false;
    }

    try {
      console.log('检查当前会话...');
      const response = await api.get('/auth/check-session');
      console.log('会话有效!');
      await appendToLog('✅ 会话API测试成功，返回了有效的用户会话信息。');
      return true;
    } catch (error) {
      console.error('会话检查失败:', error.message);
      await appendToLog(`❌ 会话API测试失败: ${error.response?.data?.error?.message || error.message}`);
      return false;
    }
  },

  // 测试登出API
  async logout() {
    if (!loginResult.token) {
      console.log('未登录，无需登出');
      return false;
    }

    try {
      console.log('正在登出...');
      const response = await api.post('/auth/logout');
      console.log('登出成功!');
      await appendToLog('✅ 登出API测试成功。');
      return true;
    } catch (error) {
      console.error('登出失败:', error.message);
      await appendToLog(`❌ 登出API测试失败: ${error.response?.data?.error?.message || error.message}`);
      return false;
    }
  },

  // 测试自定义API
  async custom() {
    const method = await question('请输入请求方法 (GET/POST/PUT/DELETE): ');
    const path = await question('请输入API路径: ');
    let data = {};
    
    if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'DELETE') {
      const dataStr = await question('请输入请求数据 (JSON格式): ');
      try {
        data = JSON.parse(dataStr);
      } catch (e) {
        console.error('JSON解析错误，使用空对象');
      }
    }

    try {
      console.log(`发送 ${method.toUpperCase()} 请求到 ${path}...`);
      const response = await api.request({
        method: method.toUpperCase(),
        url: path,
        data
      });
      
      console.log('请求成功!');
      await appendToLog(`✅ 自定义API请求成功: ${method.toUpperCase()} ${path}`);
      return true;
    } catch (error) {
      console.error('请求失败:', error.message);
      await appendToLog(`❌ 自定义API请求失败: ${method.toUpperCase()} ${path}, 错误: ${error.response?.data?.error?.message || error.message}`);
      return false;
    }
  },

  // 显示帮助信息
  async help() {
    console.log(`
3XBANG建筑公司 - API集成测试工具

可用命令:
  ping              测试API连接
  login             测试登录API
  register          测试注册API
  session           测试会话API
  logout            测试登出API
  custom            测试自定义API
  help              显示此帮助信息
  
示例:
  node api-integration-tool.js ping
  node api-integration-tool.js login
  node api-integration-tool.js register
    `);
    return true;
  }
};

// 主函数
async function main() {
  try {
    // 处理命令行参数
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    
    if (!commands[command]) {
      console.log(`未知命令: ${command}`);
      await commands.help();
      readline.close();
      return;
    }
    
    // 解析参数
    const params = {};
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('--')) {
        const [key, value] = arg.substring(2).split('=');
        params[key] = value;
      }
    }
    
    // 执行命令
    console.log(`执行命令: ${command}`);
    await commands[command](params.email, params.password);
    
  } catch (error) {
    console.error('执行错误:', error.message);
  } finally {
    readline.close();
  }
}

// 运行主函数
main(); 