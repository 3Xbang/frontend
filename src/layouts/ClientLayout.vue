<!-- 
  ClientLayout.vue
  Layout for client area pages
-->
<template>
  <div class="client-layout">
    <!-- 简单的头部 -->
    <header class="client-header">
      <div class="logo-container">
        <router-link to="/client/workflow">
          <img src="../assets/logo.png" alt="3XBANG Construction" class="logo">
          <span class="logo-text">三倍棒客户服务</span>
        </router-link>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="client-content">
      <slot></slot>
    </main>
    
    <!-- 简单的页脚 -->
    <footer class="client-footer">
      <p>&copy; 2023 三倍棒建筑公司. 保留所有权利.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ClientLayout'
}
</script>

<style scoped>
.client-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.client-header {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  height: 36px;
  margin-right: 10px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.client-content {
  flex-grow: 1;
  padding: 20px;
}

.client-footer {
  background-color: white;
  text-align: center;
  padding: 16px;
  color: #999;
  font-size: 14px;
}
</style> 