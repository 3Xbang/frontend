<!-- 
  API集成示例组件
  展示如何在Vue组件中使用前端API服务
-->
<template>
  <div class="api-example">
    <h2>API集成示例</h2>
    
    <!-- 认证部分 -->
    <div class="section auth-section">
      <h3>认证示例</h3>
      <div v-if="!isLoggedIn" class="login-form">
        <div class="form-group">
          <label>邮箱:</label>
          <input type="email" v-model="credentials.email" />
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input type="password" v-model="credentials.password" />
        </div>
        <button @click="login" :disabled="loading.login">
          {{ loading.login ? '登录中...' : '登录' }}
        </button>
        <p v-if="errors.login" class="error">{{ errors.login }}</p>
      </div>
      <div v-else class="user-info">
        <p>当前用户: {{ user?.name }}</p>
        <p>角色: {{ userRole }}</p>
        <button @click="logout">登出</button>
      </div>
    </div>
    
    <!-- 项目列表部分 -->
    <div v-if="isLoggedIn" class="section projects-section">
      <h3>项目列表</h3>
      <button @click="fetchProjects" :disabled="loading.projects">
        {{ loading.projects ? '加载中...' : '获取项目' }}
      </button>
      <div v-if="errors.projects" class="error">{{ errors.projects }}</div>
      
      <div v-if="projectsList.length" class="projects-list">
        <div v-for="project in projectsList" :key="project.id" class="project-item">
          <h4>{{ project.title }}</h4>
          <p>{{ project.description }}</p>
          <p><strong>状态:</strong> {{ project.status }}</p>
        </div>
      </div>
      <p v-else-if="!loading.projects && !errors.projects">暂无项目数据</p>
    </div>
    
    <!-- 维修申请部分 -->
    <div v-if="isLoggedIn" class="section repairs-section">
      <h3>维修申请</h3>
      <button @click="fetchRepairs" :disabled="loading.repairs">
        {{ loading.repairs ? '加载中...' : '获取维修申请' }}
      </button>
      <div v-if="errors.repairs" class="error">{{ errors.repairs }}</div>
      
      <div v-if="repairsList.length" class="repairs-list">
        <div v-for="repair in repairsList" :key="repair.id" class="repair-item">
          <h4>{{ repair.title }}</h4>
          <p>{{ repair.description }}</p>
          <p><strong>状态:</strong> {{ repair.status }}</p>
          <p><strong>紧急程度:</strong> {{ repair.urgency }}</p>
        </div>
      </div>
      <p v-else-if="!loading.repairs && !errors.repairs">暂无维修申请数据</p>
    </div>
  </div>
</template>

<script>
// 导入API服务
import { auth, projects, repairs } from '@/frontend-integration';

export default {
  name: 'ApiIntegrationExample',
  data() {
    return {
      // 登录凭证
      credentials: {
        email: '',
        password: ''
      },
      
      // 数据列表
      projectsList: [],
      repairsList: [],
      
      // 加载状态
      loading: {
        login: false,
        projects: false,
        repairs: false
      },
      
      // 错误信息
      errors: {
        login: null,
        projects: null,
        repairs: null
      }
    };
  },
  
  computed: {
    // 检查用户是否已登录
    isLoggedIn() {
      return auth.isAuthenticated();
    },
    
    // 获取当前用户信息
    user() {
      return auth.getCurrentUser();
    },
    
    // 获取用户角色
    userRole() {
      if (auth.isAdmin()) return '管理员';
      if (auth.isClient()) return '客户';
      if (auth.isEmployee()) return '员工';
      return '未知角色';
    }
  },
  
  methods: {
    // 用户登录
    async login() {
      this.loading.login = true;
      this.errors.login = null;
      
      try {
        await auth.login(this.credentials);
        this.$emit('login-success');
      } catch (error) {
        console.error('登录失败:', error);
        this.errors.login = `登录失败: ${error.message}`;
      } finally {
        this.loading.login = false;
      }
    },
    
    // 用户登出
    async logout() {
      try {
        await auth.logout();
        this.$emit('logout-success');
      } catch (error) {
        console.error('登出失败:', error);
      }
    },
    
    // 获取项目列表
    async fetchProjects() {
      this.loading.projects = true;
      this.errors.projects = null;
      
      try {
        const response = await projects.getProjects({
          limit: 5,
          page: 1
        });
        this.projectsList = response.data || [];
      } catch (error) {
        console.error('获取项目失败:', error);
        this.errors.projects = `获取项目失败: ${error.message}`;
      } finally {
        this.loading.projects = false;
      }
    },
    
    // 获取维修申请列表
    async fetchRepairs() {
      this.loading.repairs = true;
      this.errors.repairs = null;
      
      try {
        const response = await repairs.getRepairs({
          limit: 5,
          page: 1
        });
        this.repairsList = response.data || [];
      } catch (error) {
        console.error('获取维修申请失败:', error);
        this.errors.repairs = `获取维修申请失败: ${error.message}`;
      } finally {
        this.loading.repairs = false;
      }
    }
  },
  
  // 组件创建时，尝试获取会话
  async created() {
    if (this.isLoggedIn) {
      // 已登录状态下，加载初始数据
      this.fetchProjects();
    }
  }
};
</script>

<style scoped>
.api-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #3273dc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  margin-top: 10px;
}

.projects-list, .repairs-list {
  margin-top: 20px;
}

.project-item, .repair-item {
  padding: 15px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h4 {
  margin-top: 0;
  margin-bottom: 10px;
}
</style> 