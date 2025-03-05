# 3XBANG前端API集成

这个目录包含了与后端API通信所需的所有服务和工具。通过这些服务，前端组件可以方便地与后端API进行数据交互，而无需重复编写API调用代码。

## 目录结构

```
frontend-integration/
├── api.js                # 核心API客户端
├── index.js              # 导出入口
├── services/
│   ├── auth.service.js   # 认证服务
│   ├── project.service.js # 项目管理服务
│   ├── repair.service.js  # 维修申请服务
│   └── quote.service.js   # 报价服务
└── README.md             # 本文档
```

## 快速开始

### 安装

这个集成包已经包含在项目中，无需额外安装依赖。

### 在组件中使用API服务

1. 导入所需的服务:

```js
// 方式1: 导入单个服务
import { auth } from '@/frontend-integration';

// 方式2: 导入多个服务
import { auth, projects, repairs } from '@/frontend-integration';

// 方式3: 导入所有服务
import apiServices from '@/frontend-integration';
```

2. 在组件中使用:

```js
// Vue组件中使用
export default {
  data() {
    return {
      projects: [],
      loading: false,
      error: null
    }
  },
  async created() {
    try {
      this.loading = true;
      // 调用API获取项目列表
      const response = await this.projects.getProjects();
      this.projects = response.data;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async login() {
      try {
        await auth.login({
          email: this.email,
          password: this.password
        });
        // 登录成功后的处理
        this.$router.push('/dashboard');
      } catch (error) {
        // 处理登录失败
        this.loginError = error.message;
      }
    }
  }
}
```

## 可用服务

### API客户端 (api.js)

基础API客户端，处理请求发送、认证令牌、错误处理等。

```js
import { api } from '@/frontend-integration';

// 直接使用
const response = await api.get('/some/endpoint');
const data = await api.post('/some/endpoint', { data: 'value' });
```

### 认证服务 (auth.service.js)

处理用户认证、会话管理、权限检查等。

```js
import { auth } from '@/frontend-integration';

// 登录
await auth.login({ email: 'user@example.com', password: 'password' });

// 检查认证状态
if (auth.isAuthenticated()) {
  // 用户已登录
}

// 获取当前用户
const user = auth.getCurrentUser();

// 检查角色
if (auth.isAdmin()) {
  // 用户是管理员
}

// 登出
await auth.logout();
```

### 项目服务 (project.service.js)

处理项目相关操作。

```js
import { projects } from '@/frontend-integration';

// 获取项目列表
const response = await projects.getProjects({ page: 1, limit: 10 });

// 获取单个项目详情
const project = await projects.getProject('project-id');

// 创建新项目
const newProject = await projects.createProject({
  title: '新建项目',
  description: '项目描述'
});
```

### 维修申请服务 (repair.service.js)

处理维修申请相关操作。

```js
import { repairs } from '@/frontend-integration';

// 获取维修申请列表
const response = await repairs.getRepairs({ page: 1, limit: 10 });

// 创建维修申请
const newRepair = await repairs.createRepair({
  title: '设备故障',
  description: '空调不制冷',
  urgency: '高',
  address: '北京市朝阳区...',
  contactName: '张三',
  contactPhone: '13800138000'
});
```

### 报价服务 (quote.service.js)

处理报价相关操作。

```js
import { quotes } from '@/frontend-integration';

// 获取报价列表
const response = await quotes.getQuotes({ page: 1, limit: 10 });

// 接受报价
await quotes.acceptQuote('quote-id');

// 拒绝报价
await quotes.rejectQuote('quote-id', { reason: '预算超出' });
```

## 错误处理

所有服务都会抛出标准化的错误，可以在组件中使用try/catch捕获：

```js
try {
  await auth.login({ email, password });
} catch (error) {
  console.error('登录失败:', error.message);
  // 错误对象包含:
  // - message: 用户友好的错误消息
  // - code: 错误代码 (如 'UNAUTHORIZED')
  // - status: HTTP状态码 (如 401)
  // - originalError: 原始错误对象
}
```

## 配置

API服务默认使用`http://localhost:3001`作为基础URL。要更改此设置，可以在应用程序启动时配置:

```js
// 在main.js中
import { api } from '@/frontend-integration';

// 配置API基础URL
api.setBaseURL(process.env.VUE_APP_API_URL);

// 或者直接设置
api.setBaseURL('https://api.3xbang.com');
```

## 开发环境

在开发环境中，可以使用Mock服务器进行前端开发和测试。Mock服务器实现了所有的API端点并提供了模拟数据。

## 测试账号

可使用以下测试账号访问系统:

- **客户账号**:
  - 邮箱: `client@example.com`
  - 密码: `client123`

- **员工账号**:
  - 邮箱: `staff@3xbang.com`
  - 密码: `staff123`

- **管理员账号**:
  - 邮箱: `admin@3xbang.com`
  - 密码: `admin123` 