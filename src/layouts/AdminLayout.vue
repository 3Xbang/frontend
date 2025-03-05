<!-- 
  AdminLayout.vue
  Internal layout used for company management interface
-->
<template>
  <div class="admin-layout">
    <!-- Sidebar Navigation -->
    <aside :class="['sidebar', { 'collapsed': isSidebarCollapsed }]">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <h1 class="sidebar-title">3XBANG</h1>
        <button class="sidebar-toggle" @click="toggleSidebar">
          <span class="toggle-icon">
            <i class="el-icon-arrow-left" v-if="!isSidebarCollapsed"></i>
            <i class="el-icon-arrow-right" v-else></i>
          </span>
        </button>
      </div>
      
      <!-- User Info -->
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-details" v-if="!isSidebarCollapsed">
          <div class="user-name">{{ userFullName }}</div>
          <div class="user-role">{{ isAdmin ? '管理员' : '内部人员' }}</div>
        </div>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <!-- 管理员仪表盘 - 仅管理员可见 -->
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/admin/dashboard" class="nav-link">
              <span class="nav-icon"><i class="el-icon-monitor"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">管理员仪表盘</span>
            </router-link>
          </li>
          
          <!-- 普通内部人员工作区 - 仅V1权限可见 -->
          <li class="nav-item" v-if="!isAdmin">
            <router-link to="/internal/workspace" class="nav-link">
              <span class="nav-icon"><i class="el-icon-monitor"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">工作区</span>
            </router-link>
          </li>
          
          <!-- 项目管理 - 两种角色都可见 -->
          <li class="nav-item">
            <router-link to="/admin/projects" class="nav-link">
              <span class="nav-icon"><i class="el-icon-office-building"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">项目管理</span>
            </router-link>
          </li>
          
          <!-- 客户管理 - 仅管理员可见 -->
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/admin/clients" class="nav-link">
              <span class="nav-icon"><i class="el-icon-user"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">客户管理</span>
            </router-link>
          </li>
          
          <!-- 员工管理 - 仅管理员可见 -->
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/admin/employees" class="nav-link">
              <span class="nav-icon"><i class="el-icon-user-solid"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">员工管理</span>
            </router-link>
          </li>
          
          <!-- 任务管理 - 两种角色都可见 -->
          <li class="nav-item">
            <router-link to="/admin/tasks" class="nav-link">
              <span class="nav-icon"><i class="el-icon-document-checked"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">任务管理</span>
            </router-link>
          </li>
          
          <!-- 文档管理 - 两种角色都可见 -->
          <li class="nav-item">
            <router-link to="/admin/documents" class="nav-link">
              <span class="nav-icon"><i class="el-icon-document"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">文档管理</span>
            </router-link>
          </li>
          
          <!-- 图库 - 两种角色都可见 -->
          <li class="nav-item">
            <router-link to="/admin/gallery" class="nav-link">
              <span class="nav-icon"><i class="el-icon-picture"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">项目图库</span>
            </router-link>
          </li>
          
          <!-- 消息 - 两种角色都可见 -->
          <li class="nav-item">
            <router-link to="/admin/messages" class="nav-link">
              <span class="nav-icon"><i class="el-icon-message"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">消息通知</span>
              <span class="badge" v-if="!isSidebarCollapsed">5</span>
            </router-link>
          </li>
          
          <!-- 设置 - 仅管理员可见 -->
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/admin/settings" class="nav-link">
              <span class="nav-icon"><i class="el-icon-setting"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">系统设置</span>
            </router-link>
          </li>
          
          <!-- 个人设置 - 两种角色都可见 -->
          <li class="nav-item">
            <router-link to="/admin/profile" class="nav-link">
              <span class="nav-icon"><i class="el-icon-user"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">个人设置</span>
            </router-link>
          </li>
          
          <!-- 退出登录 - 两种角色都可见 -->
          <li class="nav-item">
            <a href="#" @click.prevent="logout" class="nav-link">
              <span class="nav-icon"><i class="el-icon-switch-button"></i></span>
              <span class="nav-text" v-if="!isSidebarCollapsed">退出登录</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    
    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Top Header -->
      <header class="content-header">
        <div class="header-left">
          <h2 class="page-title">{{ pageTitleComputed }}</h2>
          <div class="breadcrumb">首页 / {{ breadcrumbComputed }}</div>
        </div>
        <div class="header-right">
          <div class="header-search">
            <input type="text" placeholder="搜索..." />
            <button><i class="el-icon-search"></i></button>
          </div>
          <div class="header-notifications">
            <button class="notification-bell">
              <i class="el-icon-bell"></i>
              <span class="notification-badge">3</span>
            </button>
          </div>
          <div class="header-user">
            <div class="user-avatar">{{ userInitials }}</div>
            <div class="user-dropdown">
              <button class="dropdown-toggle" @click="toggleUserMenu">
                <span>{{ userFullName }}</span>
                <i class="el-icon-arrow-down"></i>
              </button>
              
              <!-- User Dropdown Menu -->
              <div class="dropdown-menu" v-if="isUserMenuOpen">
                <router-link to="/admin/profile" class="dropdown-item">个人设置</router-link>
                <a href="#" @click.prevent="logout" class="dropdown-item">退出登录</a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Content Area -->
      <div class="content-container">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../store/userStore'

// Store and router
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// Sidebar state
const isSidebarCollapsed = ref(false)
const isUserMenuOpen = ref(false)

// 页面标题
const pageTitle = ref('工作区')

// 用户权限
const isAdmin = computed(() => {
  const user = userStore.userData
  return user && user.permissionLevel === 'admin'
})

// 计算页面标题和面包屑
const pageTitleComputed = computed(() => {
  // 根据当前路由动态设置页面标题
  const routeName = route.name
  
  const titleMap = {
    'AdminDashboard': '管理员仪表盘',
    'InternalWorkspace': '工作区',
    // 可以根据需要添加更多路由名称与标题的映射
  }
  
  return titleMap[routeName] || pageTitle.value
})

const breadcrumbComputed = computed(() => {
  return pageTitleComputed.value
})

// Computed properties
const userFullName = computed(() => userStore.userFullName || '未登录用户')
const userInitials = computed(() => {
  if (!userStore.userFullName) return 'UN'
  const nameParts = userStore.userFullName.split(' ')
  return nameParts.map(part => part[0]).join('')
})

// Methods
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const logout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error)
  }
}

// 监听路由变化，更新页面标题
watch(() => route.name, (newRouteName) => {
  if (newRouteName) {
    const titleMap = {
      'AdminDashboard': '管理员仪表盘',
      'InternalWorkspace': '工作区',
      // 可以添加更多路由名称与标题的映射
    }
    pageTitle.value = titleMap[newRouteName] || '工作区'
  }
})

// 点击页面其他区域关闭用户菜单
onMounted(() => {
  document.addEventListener('click', (event) => {
    const userDropdown = document.querySelector('.user-dropdown')
    if (isUserMenuOpen.value && userDropdown && !userDropdown.contains(event.target)) {
      isUserMenuOpen.value = false
    }
  })
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-toggle {
  background: transparent;
  border: none;
  color: #ecf0f1;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3498db;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.user-details {
  margin-left: 10px;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  color: #bdc3c7;
}

.sidebar-nav {
  flex: 1;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.nav-item {
  margin-bottom: 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 1rem;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.2s;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 3px solid #3498db;
  padding-left: calc(1rem - 3px);
}

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.nav-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  background-color: #e74c3c;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.content-header {
  background-color: #ffffff;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.breadcrumb {
  color: #95a5a6;
  font-size: 14px;
  margin-top: 5px;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-search {
  display: flex;
  align-items: center;
  margin-right: 1rem;
  position: relative;
}

.header-search input {
  border: 1px solid #ecf0f1;
  border-radius: 20px;
  padding: 8px 15px;
  padding-right: 35px;
  background-color: #f8f9fa;
  font-size: 14px;
  width: 200px;
  transition: border-color 0.2s;
}

.header-search input:focus {
  outline: none;
  border-color: #3498db;
}

.header-search button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #95a5a6;
  cursor: pointer;
}

.header-notifications {
  margin-right: 1rem;
  position: relative;
}

.notification-bell {
  background: transparent;
  border: none;
  color: #7f8c8d;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.header-user {
  display: flex;
  align-items: center;
  position: relative;
}

.user-dropdown {
  margin-left: 10px;
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.dropdown-toggle i {
  margin-left: 5px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 100;
}

.dropdown-item {
  display: block;
  padding: 10px 15px;
  color: #2c3e50;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.content-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

@media (max-width: 992px) {
  .sidebar {
    width: 70px;
  }
  
  .sidebar-title {
    display: none;
  }
  
  .user-details {
    display: none;
  }
  
  .nav-text {
    display: none;
  }
  
  .header-search input {
    width: 150px;
  }
}

@media (max-width: 768px) {
  .header-search {
    display: none;
  }
}

@media (max-width: 576px) {
  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-right {
    margin-top: 1rem;
    width: 100%;
    justify-content: space-between;
  }
}
</style>