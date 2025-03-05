# 三倍棒建筑公司后端实现指南

本文档详细说明了为支持前端功能所需实现的后端API和数据结构。

## 1. 系统概述

我们已开发的前端系统包括:
- 用户认证(登录/登出/会话管理)
- 基于角色的访问控制(管理员/员工/客户)
- 客户工作流界面，包含多个功能模块

后端系统需实现以下核心功能:
- 用户认证与会话管理
- 数据存储与检索
- 业务逻辑处理
- API接口提供

## 2. API接口规范

### 2.1 认证相关API

#### POST /api/auth/login
- **描述**: 用户登录
- **请求体**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **响应**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "用户名称",
    "email": "user@example.com",
    "userRole": "admin|staff|client",
    "permissionLevel": "string", // 管理员/员工才有
    "company": "string" // 客户才有
  }
}
```

#### POST /api/auth/logout
- **描述**: 用户登出
- **响应**:
```json
{
  "success": true
}
```

#### GET /api/auth/session
- **描述**: 检查会话状态
- **响应**:
```json
{
  "isAuthenticated": true,
  "user": {
    "id": 1,
    "name": "用户名称",
    "email": "user@example.com",
    "userRole": "admin|staff|client",
    "permissionLevel": "string", // 管理员/员工才有
    "company": "string" // 客户才有
  }
}
```

### 2.2 客户功能API

#### GET /api/client/projects
- **描述**: 获取客户项目列表
- **响应**:
```json
{
  "projects": [
    {
      "id": 1,
      "name": "办公楼装修工程",
      "progress": 75,
      "startDate": "2023-01-15",
      "endDate": "2023-05-30"
    },
    {
      "id": 2,
      "name": "会议室改造项目",
      "progress": 40,
      "startDate": "2023-03-10",
      "endDate": "2023-06-15"
    }
  ]
}
```

#### GET /api/client/temp-works
- **描述**: 获取临时施工记录
- **响应**:
```json
{
  "tempWorks": [
    {
      "id": 1,
      "title": "电路改造",
      "date": "2023-04-10",
      "status": "pending",
      "statusText": "待审核"
    },
    {
      "id": 2,
      "title": "安装新空调",
      "date": "2023-04-05",
      "status": "approved",
      "statusText": "已批准"
    },
    {
      "id": 3,
      "title": "墙面粉刷",
      "date": "2023-03-28",
      "status": "completed",
      "statusText": "已完成"
    }
  ]
}
```

#### POST /api/client/temp-works
- **描述**: 提交临时施工申请
- **请求体**:
```json
{
  "title": "string",
  "description": "string",
  "expectedDate": "string"
}
```
- **响应**:
```json
{
  "success": true,
  "tempWork": {
    "id": 4,
    "title": "string",
    "date": "string",
    "status": "pending",
    "statusText": "待审核"
  }
}
```

#### GET /api/client/repairs/stats
- **描述**: 获取维修申请统计
- **响应**:
```json
{
  "pending": 3,
  "inProgress": 2,
  "completed": 8
}
```

#### GET /api/client/quotes
- **描述**: 获取报价列表
- **响应**:
```json
{
  "quotes": [
    {
      "id": 1,
      "title": "办公室扩建工程",
      "amount": 158000,
      "status": "pending",
      "statusText": "待确认"
    },
    {
      "id": 2,
      "title": "绿化改造",
      "amount": 36500,
      "status": "confirmed",
      "statusText": "已确认"
    }
  ]
}
```

#### PUT /api/client/quotes/:id/confirm
- **描述**: 确认报价
- **响应**:
```json
{
  "success": true,
  "quote": {
    "id": 1,
    "status": "confirmed",
    "statusText": "已确认"
  }
}
```

#### GET /api/client/receipts
- **描述**: 获取回执列表
- **响应**:
```json
{
  "receipts": [
    {
      "id": 1,
      "title": "消防系统检查",
      "date": "2023-04-08",
      "status": "pending",
      "statusText": "待确认"
    },
    {
      "id": 2,
      "title": "门禁系统安装",
      "date": "2023-03-25",
      "status": "confirmed",
      "statusText": "已确认"
    }
  ]
}
```

#### PUT /api/client/receipts/:id/confirm
- **描述**: 确认回执
- **响应**:
```json
{
  "success": true,
  "receipt": {
    "id": 1,
    "status": "confirmed",
    "statusText": "已确认"
  }
}
```

## 3. 数据模型

### 3.1 User (用户)
```
{
  id: number                // 用户ID
  name: string              // 用户名称
  email: string             // 邮箱(登录名)
  password: string          // 密码(加密存储)
  userRole: string          // 用户角色: 'admin'|'staff'|'client'
  permissionLevel?: string  // 权限级别(管理员/员工专用)
  company?: string          // 公司名称(客户专用)
  createdAt: Date           // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 3.2 Project (项目)
```
{
  id: number                // 项目ID
  clientId: number          // 客户ID
  name: string              // 项目名称
  description: string       // 项目描述
  progress: number          // 进度百分比(0-100)
  startDate: Date           // 开始日期
  endDate: Date             // 计划结束日期
  status: string            // 状态: 'pending'|'in_progress'|'completed'
  createdAt: Date           // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 3.3 TemporaryWork (临时施工)
```
{
  id: number                // ID
  clientId: number          // 客户ID
  title: string             // 标题
  description: string       // 描述
  date: Date                // 申请日期
  status: string            // 状态: 'pending'|'approved'|'completed'
  statusText: string        // 状态文本
  createdAt: Date           // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 3.4 RepairRequest (维修申请)
```
{
  id: number                // ID
  clientId: number          // 客户ID
  title: string             // 标题
  description: string       // 描述
  date: Date                // 申请日期
  status: string            // 状态: 'pending'|'in_progress'|'completed'
  createdAt: Date           // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 3.5 Quote (报价)
```
{
  id: number                // ID
  clientId: number          // 客户ID
  title: string             // 标题
  amount: number            // 金额
  status: string            // 状态: 'pending'|'confirmed'
  statusText: string        // 状态文本
  createdAt: Date           // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 3.6 Receipt (回执)
```
{
  id: number                // ID
  clientId: number          // 客户ID
  title: string             // 标题
  date: Date                // 日期
  status: string            // 状态: 'pending'|'confirmed'
  statusText: string        // 状态文本
  createdAt: Date           // 创建时间
  updatedAt: Date           // 更新时间
}
```

## 4. 测试账户

后端应预置以下测试账户:

### 管理员账户
- Email: `admin@3xbang.com`
- Password: `admin123`
- UserRole: `admin`
- Name: `管理员`
- PermissionLevel: `admin`

### 员工账户
- Email: `staff@3xbang.com`
- Password: `staff123`
- UserRole: `staff`
- Name: `员工小王`
- PermissionLevel: `V1`

### 客户账户
- Email: `client@example.com`
- Password: `client123`
- UserRole: `client`
- Name: `客户公司A`
- Company: `示范建筑公司`

## 5. 认证流程

我们的前端使用了基于LocalStorage的会话管理:

1. 用户登录成功后，后端返回用户信息
2. 前端将用户信息存储到LocalStorage
3. 前端通过检查LocalStorage中的会话信息验证用户身份
4. 用户登出时，前端清除LocalStorage中的会话信息

后端认证建议:
- 使用JWT令牌进行无状态认证
- 令牌应包含用户ID、角色和过期时间
- 实现CORS和请求验证

## 6. 启动指南

1. 创建数据库和表结构
2. 预置测试账户
3. 实现API端点
4. 配置CORS以允许前端访问
5. 实现认证中间件
6. 启动服务器并测试与前端的连接

## 7. 模拟服务器

为便于开发测试，可以先实现一个简单的模拟服务器:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 模拟数据
const users = [
  {
    id: 1,
    name: '管理员',
    email: 'admin@3xbang.com',
    password: 'admin123', // 实际应加密存储
    userRole: 'admin',
    permissionLevel: 'admin'
  },
  {
    id: 2,
    name: '员工小王',
    email: 'staff@3xbang.com',
    password: 'staff123',
    userRole: 'staff',
    permissionLevel: 'V1'
  },
  {
    id: 3,
    name: '客户公司A',
    email: 'client@example.com',
    password: 'client123',
    userRole: 'client',
    company: '示范建筑公司'
  }
];

// 登录接口
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // 返回用户信息(不含密码)
    const { password, ...userInfo } = user;
    res.json({ success: true, user: userInfo });
  } else {
    res.status(401).json({ success: false, error: '用户名或密码不正确' });
  }
});

// 会话检查接口
app.get('/api/auth/session', (req, res) => {
  // 实际应验证JWT令牌
  res.json({ isAuthenticated: true });
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});
```

## 8. 注意事项

1. 所有API响应应保持与前端期望的数据结构一致
2. 实现适当的错误处理和日志记录
3. 对所有用户输入进行验证和清理
4. 实现适当的权限检查，确保用户只能访问其有权限的资源
5. 使用HTTPS保护API通信 