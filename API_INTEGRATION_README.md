# 3XBANG建筑公司 API集成指南

本文档提供了前端团队与后端API集成的快速入门指南，包括工具使用说明、关键文件列表和开发提示。

## 关键文件

| 文件名 | 描述 |
|--------|------|
| `API_INTEGRATION_GUIDE.md` | 完整API文档，包含所有端点、请求与响应格式 |
| `API_COMMUNICATION.md` | 前后端团队沟通记录与API集成状态 |
| `api-integration-tool.js` | API测试工具，用于验证API连接和功能 |
| `src/frontend-integration/api.js` | API客户端核心文件，处理请求、响应和错误 |
| `src/frontend-integration/services/*.js` | 各功能模块的API服务 |

## 账号信息

以下是可用的测试账号：

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@repair-system.com | admin123 |
| 客户 | client@repair-system.com | client123 |
| 员工 | employee@repair-system.com | employee123 |

## API基础信息

- **开发环境URL**: http://localhost:5173
- **部署环境URL**: http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173
- **API前缀**: /api
- **内容类型**: application/json
- **认证方式**: JWT (Bearer Token)

## 使用API测试工具

API测试工具可帮助您验证API连接和基本功能，使用方法如下：

```bash
# 运行完整API测试
node api-integration-tool.js

# 测试特定功能
node api-integration-tool.js ping    # 测试API连接
node api-integration-tool.js login   # 测试登录功能
```

所有测试结果将记录在 `api-test-log.txt` 文件中。

## 集成步骤

1. **配置API客户端**:
   - 在前端应用中引入 `src/frontend-integration/api.js`
   - API客户端会根据环境自动选择正确的URL:
     - 本地开发环境: `http://localhost:5173/api`
     - 部署环境: `http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173/api`

2. **使用认证服务**:
   - 导入 `src/frontend-integration/services/auth.service.js`
   - 使用提供的方法进行登录、会话管理等操作

   ```javascript
   import authService from '@/frontend-integration/services/auth.service';
   
   // 登录
   const login = async () => {
     try {
       await authService.login({
         email: 'admin@repair-system.com',
         password: 'admin123'
       });
       // 登录成功处理
     } catch (error) {
       // 错误处理
     }
   };
   ```

3. **使用其他API服务**:
   - 根据需要导入相应的服务模块
   - 例如，使用项目服务获取项目列表
   
   ```javascript
   import projectService from '@/frontend-integration/services/project.service';
   
   // 获取项目列表
   const getProjects = async () => {
     try {
       const projects = await projectService.getProjects();
       // 处理项目数据
     } catch (error) {
       // 错误处理
     }
   };
   ```

## 注意事项

- **环境配置**: API基础URL根据环境不同有两个版本:
  - 本地开发: http://localhost:5173/api
  - 部署环境: http://gbang-1.ns-jrnsq1vz.svc.cluster.local:5173/api
- **错误处理**: 使用API客户端中的统一错误处理机制，确保用户体验一致。
- **令牌管理**: 系统自动管理JWT令牌，确保在请求头中包含正确的授权信息。
- **注册API**: 目前注册API(/api/auth/register)返回404错误，我们已向后端团队确认此功能可能不在当前迭代范围内。
- **文档同步**: 如有API变更，请确保更新`API_COMMUNICATION.md`文件。

## 疑难解答

如在集成过程中遇到问题，请按照以下步骤排查：

1. 检查API基础URL和路径是否正确。
2. 确认账号格式和认证信息。
3. 查看`api-test-log.txt`中的详细错误信息。
4. 参考`API_COMMUNICATION.md`中的最新沟通记录。
5. 使用API测试工具验证特定端点的可用性。

## 后续计划

1. 完成会话检查和登出功能测试
2. 实现其他业务模块的API集成
3. 建立完整的错误处理和重试机制
4. 优化API客户端性能和缓存策略

---

如有任何问题，请联系前端开发团队。 