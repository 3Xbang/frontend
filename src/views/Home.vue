<!-- 
  Home.vue
  Landing page for the construction company website
-->
<template>
  <div class="home-page">
    <!-- Hero section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>三倍棒建筑公司</h1>
        <p class="hero-subtitle">专业的工程建设与装修服务</p>
        <div class="hero-buttons">
          <router-link to="/login" class="btn btn-primary">内部登录</router-link>
          <router-link to="/client/login" class="btn btn-secondary">客户登录</router-link>
        </div>
      </div>
    </section>
    
    <!-- Services section -->
    <section class="services-section">
      <h2 class="section-title">我们的服务</h2>
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">🏢</div>
          <h3>商业建筑</h3>
          <p>办公楼、商场、酒店等商业空间的建设与装修</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🏠</div>
          <h3>住宅工程</h3>
          <p>住宅小区、别墅、公寓等居住空间的建设与装修</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🔧</div>
          <h3>工程维护</h3>
          <p>为已完工项目提供长期的维护与保养服务</p>
        </div>
        <div class="service-card">
          <div class="service-icon">✨</div>
          <h3>空间改造</h3>
          <p>老旧建筑的翻新、改造与功能升级</p>
        </div>
      </div>
    </section>
    
    <!-- Client login section -->
    <section class="client-section">
      <div class="client-login-info">
        <h2>客户服务平台</h2>
        <p>已有项目的客户可以登录查看项目进度、申请临时施工、提交维修申请等</p>
        <div class="test-account">
          <h4>测试账号</h4>
          <p>邮箱: client@example.com</p>
          <p>密码: client123</p>
        </div>
        <router-link to="/client/login" class="btn btn-large">立即登录客户平台</router-link>
      </div>
    </section>
    
    <!-- API集成示例 -->
    <section class="api-example-section">
      <div class="api-example-info">
        <h2>API集成示例</h2>
        <p>查看前端与后端API集成的示例页面，演示API服务的使用方法</p>
        <router-link to="/api-example" class="btn btn-outline">查看API集成示例</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectStore } from '../store/projectStore'

// Store
const projectStore = useProjectStore()

// Data
const featuredProjects = ref([])

// Lifecycle hooks
onMounted(async () => {
  await projectStore.fetchProjects()
  // Get the first 2 projects for the featured section
  featuredProjects.value = projectStore.projects.slice(0, 2)
})
</script>

<style scoped>
.home-page {
  max-width: 100%;
  overflow-x: hidden;
}

.hero-section {
  height: 500px;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url('../assets/hero-bg.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.hero-content {
  max-width: 800px;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 24px;
  margin-bottom: 40px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  border-radius: 5px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: bold;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-primary:hover {
  background-color: #40a9ff;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid #1890ff;
  color: white;
}

.btn-secondary:hover {
  background-color: rgba(24, 144, 255, 0.1);
  transform: translateY(-2px);
}

.btn-large {
  padding: 14px 36px;
  font-size: 18px;
  display: inline-block;
  margin-top: 20px;
  background-color: #1890ff;
  color: white;
}

.btn-large:hover {
  background-color: #40a9ff;
  transform: translateY(-2px);
}

.btn-outline {
  padding: 14px 36px;
  font-size: 18px;
  display: inline-block;
  margin-top: 20px;
  background-color: transparent;
  border: 2px solid #1890ff;
  color: #1890ff;
}

.btn-outline:hover {
  background-color: #1890ff;
  color: white;
  transform: translateY(-2px);
}

.services-section {
  padding: 80px 20px;
  text-align: center;
  background-color: #f5f7fa;
}

.section-title {
  font-size: 36px;
  margin-bottom: 60px;
  color: #333;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-10px);
}

.service-icon {
  font-size: 40px;
  margin-bottom: 20px;
}

.service-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.service-card p {
  color: #666;
  line-height: 1.6;
}

.client-section {
  padding: 80px 20px;
  background-color: #e6f7ff;
  display: flex;
  justify-content: center;
}

.client-login-info {
  max-width: 600px;
  text-align: center;
}

.client-login-info h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
}

.client-login-info p {
  margin-bottom: 30px;
  color: #555;
  font-size: 18px;
  line-height: 1.6;
}

.test-account {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  display: inline-block;
  text-align: left;
}

.test-account h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #1890ff;
}

.api-example-section {
  padding: 80px 20px;
  background-color: #f0f5ff;
  display: flex;
  justify-content: center;
}

.api-example-info {
  max-width: 600px;
  text-align: center;
}

.api-example-info h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
}

.api-example-info p {
  margin-bottom: 30px;
  color: #555;
  font-size: 18px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .hero-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .section-title {
    font-size: 28px;
  }
}
</style> 