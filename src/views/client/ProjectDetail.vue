<template>
  <div class="project-detail">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载项目数据中...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="goBack" class="back-button">返回项目列表</button>
    </div>
    
    <div v-else class="project-content">
      <!-- 页面顶部：项目基本信息 -->
      <div class="project-header" :style="{ backgroundImage: `url(${project.imageUrl})` }">
        <div class="header-overlay">
          <div class="container">
            <div class="project-status" :class="project.status">
              {{ getStatusText(project.status) }}
            </div>
            <h1 class="project-title">{{ project.title }}</h1>
            <div class="project-meta">
              <div class="meta-item">
                <i class="meta-icon">📍</i>
                <span>{{ project.location }}</span>
              </div>
              <div class="meta-item">
                <i class="meta-icon">📅</i>
                <span>开始日期: {{ formatDate(project.startDate) }}</span>
              </div>
              <div class="meta-item" v-if="project.endDate">
                <i class="meta-icon">🏁</i>
                <span>结束日期: {{ formatDate(project.endDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 项目详情内容 -->
      <div class="container">
        <div class="content-grid">
          <!-- 左侧详情 -->
          <div class="detail-section">
            <h2 class="section-title">项目详情</h2>
            <div class="description-box">
              <p>{{ project.description }}</p>
            </div>
            
            <h2 class="section-title">项目特点</h2>
            <ul class="features-list">
              <li v-for="(feature, index) in project.features" :key="index">
                <i class="feature-icon">✓</i>
                <span>{{ feature }}</span>
              </li>
            </ul>
            
            <h2 class="section-title">项目进度</h2>
            <div class="progress-timeline">
              <div class="timeline-item" v-for="(task, index) in project.tasks" :key="index">
                <div class="timeline-icon" :class="{ completed: task.completed }">
                  {{ index + 1 }}
                </div>
                <div class="timeline-content">
                  <h3 class="task-title">{{ task.title }}</h3>
                  <p class="task-description">{{ task.description }}</p>
                  <div class="task-date">
                    <span>{{ formatDate(task.date) }}</span>
                    <span class="task-status" :class="{ completed: task.completed }">
                      {{ task.completed ? '已完成' : '进行中' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧边栏 -->
          <div class="sidebar">
            <div class="info-card">
              <h3 class="card-title">项目团队</h3>
              <div class="team-members">
                <div class="team-member" v-for="(member, index) in project.team" :key="index">
                  <div class="member-avatar">
                    {{ member.name.charAt(0) }}
                  </div>
                  <div class="member-info">
                    <p class="member-name">{{ member.name }}</p>
                    <p class="member-role">{{ member.role }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="info-card">
              <h3 class="card-title">项目文档</h3>
              <ul class="documents-list">
                <li v-for="(doc, index) in project.documents" :key="index">
                  <a :href="doc.url" target="_blank" class="document-link">
                    <i class="document-icon">📄</i>
                    <span>{{ doc.name }}</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div class="info-card">
              <h3 class="card-title">联系项目经理</h3>
              <div class="contact-form">
                <div class="form-group">
                  <label for="contact-subject">主题</label>
                  <input type="text" id="contact-subject" v-model="contactForm.subject" placeholder="请输入您的问题主题" />
                </div>
                <div class="form-group">
                  <label for="contact-message">消息</label>
                  <textarea id="contact-message" v-model="contactForm.message" placeholder="请详细描述您的问题或需求"></textarea>
                </div>
                <button @click="sendMessage" class="send-button" :disabled="isSending">
                  {{ isSending ? '发送中...' : '发送消息' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 图片库 -->
        <div class="gallery-section">
          <h2 class="section-title">项目图片</h2>
          <div class="gallery-grid">
            <div v-for="(image, index) in project.gallery" :key="index" class="gallery-item" @click="openImage(image.url)">
              <img :src="image.url" :alt="image.caption" class="gallery-image" />
              <div class="image-caption">{{ image.caption }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部返回按钮 -->
      <div class="container">
        <div class="actions-footer">
          <button @click="goBack" class="back-button">返回项目列表</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'ProjectDetail',
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    const projectId = route.params.id;
    
    const project = ref(null);
    const isLoading = ref(true);
    const error = ref(null);
    const isSending = ref(false);
    
    const contactForm = reactive({
      subject: '',
      message: ''
    });
    
    // 获取项目详情
    const fetchProjectDetail = async () => {
      isLoading.value = true;
      error.value = null;
      
      try {
        // 在实际应用中，这里应该调用API获取数据
        // 这里使用模拟数据用于演示
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 模拟项目数据
        const mockProject = {
          id: parseInt(projectId),
          title: '现代办公楼改造',
          description: '本项目是对一座位于上海浦东的旧办公楼进行全面翻新改造。该建筑建于2000年，经过20多年的使用，内部设施已经老化，空间布局也不再适应现代办公需求。我们的改造方案包括结构加固、内部空间重新规划、增加智能化系统、提升能源效率、改善室内环境质量等多个方面。改造后的建筑将满足现代企业对灵活、健康、智能化办公环境的需求，同时大幅降低能源消耗。',
          location: '上海市浦东新区',
          startDate: '2023-05-10',
          endDate: '2023-12-15',
          status: 'inProgress',
          imageUrl: 'https://images.unsplash.com/photo-1556156653-e5a7668c3a2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
          features: [
            '结构加固与安全提升',
            '内部空间重新规划与优化',
            '智能楼宇控制系统',
            '节能照明与空调系统',
            '现代化办公设施',
            '绿色环保材料应用',
            '提升无障碍设施',
            '改善室内空气质量'
          ],
          tasks: [
            {
              title: '项目规划与设计',
              description: '完成项目需求分析、方案设计和施工图纸',
              date: '2023-05-10',
              completed: true
            },
            {
              title: '内部拆除工作',
              description: '拆除旧内部装修、不需要的隔墙和过时设施',
              date: '2023-06-15',
              completed: true
            },
            {
              title: '结构加固施工',
              description: '对建筑结构进行加固，提升抗震能力',
              date: '2023-07-20',
              completed: true
            },
            {
              title: '新隔墙与地板铺设',
              description: '按新设计安装隔墙、铺设新地板',
              date: '2023-08-25',
              completed: false
            },
            {
              title: '电气与网络系统安装',
              description: '安装新的电气系统、网络布线和智能控制系统',
              date: '2023-10-01',
              completed: false
            },
            {
              title: '室内装修与家具安装',
              description: '完成内部装修、安装办公家具和设备',
              date: '2023-11-15',
              completed: false
            }
          ],
          team: [
            { name: '张工', role: '项目经理' },
            { name: '李工', role: '结构工程师' },
            { name: '王工', role: '电气工程师' },
            { name: '赵工', role: '室内设计师' },
            { name: '刘工', role: '安全监督' }
          ],
          documents: [
            { name: '项目方案说明书.pdf', url: '#' },
            { name: '改造进度计划.pdf', url: '#' },
            { name: '材料清单.xlsx', url: '#' },
            { name: '施工安全要求.pdf', url: '#' }
          ],
          gallery: [
            { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', caption: '办公楼外观' },
            { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', caption: '大厅设计效果图' },
            { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', caption: '开放办公区' },
            { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', caption: '会议室设计' },
            { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', caption: '休闲区设计' },
            { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', caption: '智能控制系统' }
          ]
        };
        
        project.value = mockProject;
      } catch (err) {
        console.error('获取项目详情失败:', err);
        error.value = '无法加载项目详情，请稍后再试。';
      } finally {
        isLoading.value = false;
      }
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '待定';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    };
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        planning: '规划中',
        inProgress: '进行中',
        completed: '已完成'
      };
      return statusMap[status] || '未知状态';
    };
    
    // 发送联系消息
    const sendMessage = async () => {
      if (!contactForm.subject || !contactForm.message) {
        alert('请填写完整的联系信息');
        return;
      }
      
      isSending.value = true;
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 清空表单
        contactForm.subject = '';
        contactForm.message = '';
        
        // 显示成功消息
        alert('消息已发送，项目经理会尽快回复您！');
      } catch (error) {
        alert('发送失败，请稍后再试');
      } finally {
        isSending.value = false;
      }
    };
    
    // 返回项目列表
    const goBack = () => {
      router.push('/client/projects');
    };
    
    // 打开图片
    const openImage = (url) => {
      window.open(url, '_blank');
    };
    
    // 组件挂载时获取数据
    onMounted(fetchProjectDetail);
    
    return {
      project,
      isLoading,
      error,
      contactForm,
      isSending,
      formatDate,
      getStatusText,
      sendMessage,
      goBack,
      openImage
    };
  }
};
</script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #ffd700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}

.error-container {
  text-align: center;
  padding: 50px 20px;
  
  .error-message {
    color: #e74c3c;
    font-size: 18px;
    margin-bottom: 20px;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.project-header {
  background-size: cover;
  background-position: center;
  position: relative;
  
  .header-overlay {
    background: rgba(0, 0, 0, 0.6);
    padding: 80px 0;
    
    .project-title {
      color: #fff;
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 20px 0;
    }
    
    .project-status {
      display: inline-block;
      padding: 6px 15px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
      color: #fff;
      margin-bottom: 15px;
      
      &.planning {
        background-color: #3498db;
      }
      
      &.inProgress {
        background-color: #f39c12;
      }
      
      &.completed {
        background-color: #2ecc71;
      }
    }
    
    .project-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      
      .meta-item {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 16px;
        
        .meta-icon {
          margin-right: 8px;
        }
      }
    }
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  padding: 50px 0;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #333;
  position: relative;
  padding-bottom: 10px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: #ffd700;
  }
}

.description-box {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 40px;
  
  p {
    font-size: 16px;
    line-height: 1.8;
    color: #555;
    margin: 0;
  }
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background-color: #ffd700;
      border-radius: 50%;
      margin-right: 15px;
      font-size: 14px;
      color: #333;
    }
    
    span {
      font-size: 16px;
      color: #555;
    }
  }
}

.progress-timeline {
  margin-bottom: 40px;
  
  .timeline-item {
    display: flex;
    margin-bottom: 25px;
    position: relative;
    
    &:not(:last-child)::before {
      content: '';
      position: absolute;
      top: 35px;
      left: 15px;
      width: 1px;
      height: calc(100% - 10px);
      background-color: #ddd;
    }
    
    .timeline-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      background-color: #f0f0f0;
      border-radius: 50%;
      margin-right: 20px;
      font-size: 12px;
      font-weight: bold;
      color: #666;
      z-index: 1;
      
      &.completed {
        background-color: #ffd700;
        color: #333;
      }
    }
    
    .timeline-content {
      flex: 1;
      
      .task-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 5px 0;
        color: #333;
      }
      
      .task-description {
        font-size: 14px;
        color: #666;
        margin: 0 0 10px 0;
      }
      
      .task-date {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #888;
        
        .task-status {
          font-weight: 600;
          
          &.completed {
            color: #2ecc71;
          }
        }
      }
    }
  }
}

.info-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
  margin-bottom: 30px;
  
  .card-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 20px 0;
    color: #333;
    border-bottom: 2px solid #ffd700;
    padding-bottom: 10px;
  }
}

.team-members {
  .team-member {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    .member-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #ffd700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #333;
      margin-right: 15px;
    }
    
    .member-info {
      .member-name {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        color: #333;
      }
      
      .member-role {
        font-size: 14px;
        color: #666;
        margin: 5px 0 0 0;
      }
    }
  }
}

.documents-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 12px;
    
    .document-link {
      display: flex;
      align-items: center;
      color: #3498db;
      text-decoration: none;
      font-size: 15px;
      transition: color 0.3s;
      
      &:hover {
        color: #2980b9;
      }
      
      .document-icon {
        margin-right: 10px;
      }
    }
  }
}

.contact-form {
  .form-group {
    margin-bottom: 15px;
    
    label {
      display: block;
      font-size: 14px;
      margin-bottom: 5px;
      color: #666;
    }
    
    input, textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      
      &:focus {
        border-color: #ffd700;
        outline: none;
      }
    }
    
    textarea {
      height: 120px;
      resize: vertical;
    }
  }
  
  .send-button {
    width: 100%;
    padding: 12px;
    background-color: #ffd700;
    color: #333;
    border: none;
    border-radius: 5px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: darken(#ffd700, 10%);
    }
    
    &:disabled {
      background-color: #f5f5f5;
      color: #999;
      cursor: not-allowed;
    }
  }
}

.gallery-section {
  padding: 30px 0 50px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  .gallery-item {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    
    &:hover {
      .gallery-image {
        transform: scale(1.05);
      }
      
      .image-caption {
        opacity: 1;
      }
    }
    
    .gallery-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      transition: transform 0.5s;
    }
    
    .image-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 15px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }
}

.actions-footer {
  padding: 20px 0 50px;
  text-align: center;
  
  .back-button {
    padding: 12px 25px;
    background-color: #f5f5f5;
    color: #333;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #e0e0e0;
    }
  }
}

// 响应式布局
@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .project-header {
    .header-overlay {
      padding: 50px 0;
      
      .project-title {
        font-size: 28px;
      }
      
      .project-meta {
        flex-direction: column;
        gap: 10px;
      }
    }
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style> 