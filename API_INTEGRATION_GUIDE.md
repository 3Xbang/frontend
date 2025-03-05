# 3XBANG建筑公司 API集成指南

本文档提供了3XBANG建筑公司API的完整集成指南，包括认证方式、可用的API端点、请求与响应格式、错误处理等信息。

## 目录

1. [基本信息](#基本信息)
2. [认证方式](#认证方式)
3. [API端点](#API端点)
   - [认证相关API](#认证相关API)
   - [用户管理](#用户管理)
   - [项目管理](#项目管理)
   - [维修请求](#维修请求)
   - [报价管理](#报价管理)
4. [错误处理](#错误处理)
5. [集成示例](#集成示例)

## 基本信息

- **API基础URL**: `http://localhost:5173`
- **API前缀**: `/api`
- **内容类型**: `application/json`
- **版本**: `1.0.0`

## 认证方式

API使用JWT（JSON Web Token）进行认证。认证流程如下：

1. 用户登录获取token
2. 将token添加到请求头：`Authorization: Bearer {token}`
3. Token有效期为24小时，过期后需重新登录

### 测试账号

| 角色 | 邮箱 | 密码 |
|----------|---------------------------|-----------|
| 管理员 | admin@repair-system.com | admin123 |
| 客户 | client@repair-system.com | client123 |
| 员工 | employee@repair-system.com| employee123|

## API端点

### 认证相关API

#### 登录

- **路径**: `/api/auth/login`
- **方法**: `POST`
- **描述**: 验证用户身份并返回JWT令牌
- **请求体**:
  ```json
  {
    "email": "example@repair-system.com",
    "password": "yourpassword"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "email": "example@repair-system.com",
      "name": "用户名",
      "role": "admin" // 可能的值: admin, client, employee
    }
  }
  ```
- **错误响应** (401):
  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "电子邮箱或密码不正确"
    }
  }
  ```

#### 注册

- **路径**: `/api/auth/register`
- **方法**: `POST`
- **描述**: 创建新用户账号
- **请求体**:
  ```json
  {
    "email": "new-user@repair-system.com",
    "password": "securepassword",
    "name": "新用户",
    "role": "client" // 可选，默认为client
  }
  ```
- **成功响应** (201):
  ```json
  {
    "success": true,
    "message": "用户注册成功",
    "user": {
      "id": "user456",
      "email": "new-user@repair-system.com",
      "name": "新用户",
      "role": "client"
    }
  }
  ```

#### 会话检查

- **路径**: `/api/auth/check-session`
- **方法**: `GET`
- **描述**: 验证当前会话并返回用户信息
- **请求头**: 需要包含有效的JWT令牌
- **成功响应** (200):
  ```json
  {
    "success": true,
    "user": {
      "id": "user123",
      "email": "example@repair-system.com",
      "name": "用户名",
      "role": "admin"
    }
  }
  ```
- **错误响应** (401):
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "未授权访问"
    }
  }
  ```

#### 登出

- **路径**: `/api/auth/logout`
- **方法**: `POST`
- **描述**: 结束用户会话
- **请求头**: 需要包含有效的JWT令牌
- **成功响应** (200):
  ```json
  {
    "success": true,
    "message": "用户已成功登出"
  }
  ```

### 用户管理

#### 获取用户列表

- **路径**: `/api/users`
- **方法**: `GET`
- **描述**: 获取用户列表（仅限管理员）
- **请求头**: 需要包含有效的JWT令牌
- **查询参数**:
  - `page`: 页码，默认为1
  - `limit`: 每页记录数，默认为10
  - `search`: 搜索关键词
- **成功响应** (200):
  ```json
  {
    "success": true,
    "users": [
      {
        "id": "user123",
        "email": "user1@repair-system.com",
        "name": "用户1",
        "role": "client"
      },
      {
        "id": "user456",
        "email": "user2@repair-system.com",
        "name": "用户2",
        "role": "employee"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  }
  ```

### 项目管理

#### 获取项目列表

- **路径**: `/api/projects`
- **方法**: `GET`
- **描述**: 获取项目列表
- **请求头**: 需要包含有效的JWT令牌
- **查询参数**:
  - `page`: 页码，默认为1
  - `limit`: 每页记录数，默认为10
  - `status`: 项目状态筛选（completed, ongoing, all）
  - `search`: 搜索关键词
- **成功响应** (200):
  ```json
  {
    "success": true,
    "projects": [
      {
        "id": "proj123",
        "title": "项目标题",
        "description": "项目描述",
        "status": "ongoing",
        "client": {
          "id": "client123",
          "name": "客户名称"
        },
        "startDate": "2023-01-15",
        "endDate": "2023-06-30"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15
    }
  }
  ```

#### 获取项目详情

- **路径**: `/api/projects/:id`
- **方法**: `GET`
- **描述**: 获取特定项目的详细信息
- **请求头**: 需要包含有效的JWT令牌
- **成功响应** (200):
  ```json
  {
    "success": true,
    "project": {
      "id": "proj123",
      "title": "项目标题",
      "description": "项目详细描述",
      "status": "ongoing",
      "client": {
        "id": "client123",
        "name": "客户名称",
        "email": "client@repair-system.com"
      },
      "employees": [
        {
          "id": "emp123",
          "name": "员工1"
        },
        {
          "id": "emp456",
          "name": "员工2"
        }
      ],
      "startDate": "2023-01-15",
      "endDate": "2023-06-30",
      "budget": 15000,
      "images": ["url1.jpg", "url2.jpg"]
    }
  }
  ```

### 维修请求

#### 获取维修请求列表

- **路径**: `/api/repair-requests`
- **方法**: `GET`
- **描述**: 获取维修请求列表
- **请求头**: 需要包含有效的JWT令牌
- **查询参数**:
  - `page`: 页码，默认为1
  - `limit`: 每页记录数，默认为10
  - `status`: 请求状态筛选（pending, approved, completed, cancelled）
  - `search`: 搜索关键词
- **成功响应** (200):
  ```json
  {
    "success": true,
    "repairRequests": [
      {
        "id": "req123",
        "title": "维修请求标题",
        "description": "维修问题描述",
        "status": "pending",
        "client": {
          "id": "client123",
          "name": "客户名称"
        },
        "createdAt": "2023-03-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8
    }
  }
  ```

### 报价管理

#### 获取报价列表

- **路径**: `/api/quotes`
- **方法**: `GET`
- **描述**: 获取报价列表
- **请求头**: 需要包含有效的JWT令牌
- **查询参数**:
  - `page`: 页码，默认为1
  - `limit`: 每页记录数，默认为10
  - `status`: 报价状态筛选（pending, accepted, rejected）
  - `search`: 搜索关键词
- **成功响应** (200):
  ```json
  {
    "success": true,
    "quotes": [
      {
        "id": "quote123",
        "title": "项目报价",
        "amount": 5000,
        "status": "pending",
        "client": {
          "id": "client123",
          "name": "客户名称"
        },
        "project": {
          "id": "proj123",
          "title": "项目标题"
        },
        "createdAt": "2023-03-10T09:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12
    }
  }
  ```

## 错误处理

所有API错误都会返回一个统一格式的响应。错误响应包含一个`success`字段（值为`false`）和一个包含错误代码和消息的`error`对象。

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读的错误消息"
  }
}
```

### 常见错误代码

| 代码 | 描述 |
|---------------------|------------------------------|
| INVALID_CREDENTIALS | 邮箱或密码不正确 |
| UNAUTHORIZED        | 未授权访问（无效或过期的令牌） |
| FORBIDDEN           | 权限不足 |
| NOT_FOUND           | 资源未找到 |
| VALIDATION_ERROR    | 请求数据验证失败 |
| INTERNAL_ERROR      | 服务器内部错误 |

## 集成示例

### 使用Axios进行API请求

```javascript
import axios from 'axios';

// 创建API客户端
const api = axios.create({
  baseURL: 'http://localhost:5173/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器，自动添加token到请求头
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 登录示例
async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('登录失败:', error.response.data);
    throw error;
  }
}

// 获取项目列表示例
async function getProjects(page = 1, limit = 10) {
  try {
    const response = await api.get('/projects', {
      params: { page, limit }
    });
    return response.data.projects;
  } catch (error) {
    console.error('获取项目失败:', error.response.data);
    throw error;
  }
}
```

### 处理认证和会话管理

```javascript
// 检查用户是否已认证
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// 获取当前用户
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// 检查会话并自动更新用户信息
async function checkSession() {
  try {
    const response = await api.get('/auth/check-session');
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    }
    return null;
  } catch (error) {
    // 会话已过期或无效，清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
}

// 登出
async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    // 无论请求是否成功，都清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
```

---

如有任何集成问题，请联系后端开发团队获取支持。 