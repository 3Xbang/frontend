# 3XBANG建筑公司后端开发指南

## 项目概览

3XBANG建筑公司管理系统是一个多角色的企业管理平台，支持管理员、员工和客户三种角色。本项目已经完成了前端开发，现在需要实现与之匹配的后端API和数据库。

## 主要功能

1. **用户认证** - 登录、登出和会话管理
2. **客户工作流** - 客户登录后查看:
   - 项目进度
   - 临时施工申请
   - 维修申请
   - 报价确认
   - 回执确认
3. **内部员工系统** - 员工功能:
   - 薪资管理 - 查看薪资明细、历史记录和预估薪资
   - 考勤管理 - 查看考勤记录、统计和日历视图
   - 考勤更正 - 提交考勤异常更正申请
   - 请假申请 - 提交各类请假申请和查看历史
4. **内部管理系统** - 管理员功能:
   - 员工管理 - 添加、编辑、查看员工信息
   - 项目管理 - 创建和管理公司项目
   - 客户管理 - 管理客户账户和权限
   - 审批功能 - 处理请假、考勤更正等审批事项

## 文件结构

本仓库包含以下重要文件:

- `BACKEND_IMPLEMENTATION_GUIDE.md` - 详细的后端实现规范
- `mock-server.js` - 模拟后端服务器示例
- `mock-server-package.json` - 模拟服务器的依赖文件
- `API_DOCUMENTATION.md` - 详细的API接口文档
- `DATA_MODELS.md` - 数据模型文档

## 快速开始

要测试模拟服务器:

1. 安装依赖:
```bash
cp mock-server-package.json package.json
npm install
```

2. 启动模拟服务器:
```bash
npm start
```

3. 服务器将在http://localhost:3001运行

## 测试账户

系统支持三种角色的测试账户:

- **管理员**: admin@3xbang.com / admin123
- **员工**: staff@3xbang.com / staff123
- **客户**: client@example.com / client123

## API文档

完整的API规范请查看`API_DOCUMENTATION.md`文件。

主要API端点包括:

### 认证与用户管理
- 认证: `/api/auth/login`, `/api/auth/logout`, `/api/auth/session`
- 用户管理: `/api/users`, `/api/users/:id`

### 客户相关API
- 客户项目: `/api/client/projects`
- 临时施工: `/api/client/temp-works`
- 维修申请: `/api/client/repairs/stats`
- 报价确认: `/api/client/quotes`
- 回执确认: `/api/client/receipts`

### 员工内部系统API
- 薪资系统: `/api/salary`, `/api/salary/history`
- 考勤系统: `/api/attendance`
- 考勤更正: `/api/attendance/correction`
- 请假系统: `/api/leave/history`, `/api/leave/apply`, `/api/leave/:id/cancel`

### 管理系统API
- 项目管理: `/api/projects`, `/api/projects/:id`
- 客户管理: `/api/clients`, `/api/clients/:id`
- 员工管理: `/api/employees`, `/api/employees/:id`

## 数据模型

系统需要实现以下数据模型:

1. **User (用户)** - 基本用户账户信息
2. **Employee (员工)** - 员工详细信息
3. **Client (客户)** - 客户公司信息
4. **Project (项目)** - 项目详情和进度
5. **TemporaryWork (临时施工)** - 临时施工申请
6. **RepairRequest (维修申请)** - 维修请求
7. **Quote (报价)** - 项目报价确认
8. **Receipt (回执)** - 工作回执确认
9. **Salary (薪资)** - 员工薪资记录
10. **DailyWorkRecord (日工作记录)** - 每日考勤记录
11. **Attendance (考勤)** - 月度考勤统计
12. **AttendanceCorrection (考勤更正)** - 考勤异常更正申请
13. **LeaveApplication (请假申请)** - 各类请假记录

详细字段定义请参考`DATA_MODELS.md`。

## 技术要求

建议使用以下技术栈:

- Node.js + Express.js
- MongoDB 或 MySQL
- JWT 认证
- RESTful API 设计

## 安全考虑

1. 所有密码必须哈希存储
2. 实现基于角色的访问控制
3. 验证所有API输入
4. 使用HTTPS保护通信
5. 敏感信息（如薪资数据）需要额外访问权限控制

## 后端实现清单

为了确保所有功能都被实现，请确保完成以下功能:

1. **基础设施**
   - 数据库连接设置
   - 中间件配置 (认证、CORS、请求解析)
   - 错误处理机制
   - 日志记录系统

2. **认证系统**
   - 用户登录/登出
   - JWT令牌生成与验证
   - 密码加密与验证
   - 会话管理

3. **客户功能**
   - 项目进度查询
   - 临时施工申请提交与查询
   - 维修请求统计
   - 报价确认功能
   - 回执确认功能

4. **员工内部系统**
   - 薪资查询与历史记录
   - 考勤记录与统计
   - 考勤更正申请
   - 请假申请与记录查询

5. **管理功能**
   - 项目CRUD操作
   - 员工CRUD操作
   - 客户CRUD操作
   - 各类审批功能

## 数据库设计要点

1. **关系设计**
   - 用户与员工/客户的一对一关系
   - 项目与客户的多对一关系
   - 员工与薪资记录的一对多关系
   - 员工与考勤记录的一对多关系

2. **索引优化**
   - 对常用查询字段创建索引
   - 优化薪资和考勤查询性能

3. **数据完整性**
   - 外键约束（关系型数据库）
   - 数据验证规则

## 后续开发

完成后端开发后，需要:

1. 更新前端API请求地址
2. 配置生产环境部署
3. 实现完整的错误处理和日志记录
4. 添加数据备份与恢复机制
5. 实施性能监控系统

## 已创建的后端文件

本项目已经创建了以下后端相关文件:

1. **API_DOCUMENTATION.md**
   - 详细记录了所有API端点的规范
   - 包含请求方法、URL、参数说明和响应格式
   - 覆盖了认证、项目管理、客户功能、薪资、考勤和请假系统等所有API

2. **DATA_MODELS.md**
   - 详细描述了所有数据模型的结构
   - 包含每个模型的字段说明、类型和关系
   - 覆盖了13个主要数据模型和它们之间的关系

3. **BACKEND_IMPLEMENTATION_GUIDE.md**
   - 为后端开发人员提供详细的实现指南
   - 包含系统概述、API规范、数据模型和认证流程
   - 提供了具体的技术实现建议和注意事项

4. **mock-server.js**
   - 完整的模拟后端服务器实现
   - 包含所有API端点的模拟响应
   - 实现了用户认证、客户工作流和内部员工系统的所有功能
   - 使用模拟数据提供完整的API体验

5. **mock-server-package.json**
   - 包含运行模拟服务器所需的依赖配置
   - 设置了启动脚本和开发环境

这些文件为后端开发提供了全面的指导和支持。开发者可以选择:
- 按照文档指南从头开发完整的后端系统
- 使用模拟服务器作为参考，逐步实现真实的后端功能
- 在开发过程中使用模拟服务器进行前端测试

所有文件都保持同步更新，确保API规范、数据模型和实现指南之间的一致性。

## 联系方式

如有任何问题，请联系项目管理员。 