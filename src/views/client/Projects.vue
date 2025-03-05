<template>
  <div class="client-projects">
    <h1 class="page-title">我的项目</h1>
    
    <div class="project-filters">
      <div class="filter-group">
        <label for="status-filter">项目状态</label>
        <select id="status-filter" v-model="filters.status">
          <option value="">全部</option>
          <option value="planning">规划中</option>
          <option value="inProgress">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>
      
      <div class="search-group">
        <input 
          type="text" 
          v-model="filters.search" 
          placeholder="搜索项目..."
          class="search-input"
        />
      </div>
    </div>
    
    <!-- 项目列表 -->
    <div class="projects-grid">
      <div v-if="isLoading" class="loading-indicator">
        加载中...
      </div>
      
      <div v-else-if="filteredProjects.length === 0" class="no-projects">
        暂无项目数据
      </div>
      
      <div 
        v-else
        v-for="project in filteredProjects" 
        :key="project.id"
        class="project-card"
        @click="viewProjectDetails(project.id)"
      >
        <div class="project-image">
          <img :src="project.imageUrl" :alt="project.title" />
          <div class="project-status" :class="project.status">
            {{ getStatusText(project.status) }}
          </div>
        </div>
        
        <div class="project-info">
          <h3 class="project-title">{{ project.title }}</h3>
          <p class="project-location">
            <i class="location-icon">📍</i> {{ project.location }}
          </p>
          <div class="project-dates">
            <span class="date-label">开始日期:</span> {{ formatDate(project.startDate) }}
            <span v-if="project.endDate">
              <br><span class="date-label">结束日期:</span> {{ formatDate(project.endDate) }}
            </span>
          </div>
          <div class="project-description">
            {{ truncateText(project.description, 100) }}
          </div>
        </div>
        
        <div class="project-footer">
          <button class="view-details-btn">查看详情</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ClientProjects',
  
  setup() {
    const router = useRouter();
    const projects = ref([]);
    const isLoading = ref(true);
    const filters = ref({
      status: '',
      search: ''
    });
    
    // 模拟获取项目数据
    const fetchProjects = async () => {
      isLoading.value = true;
      
      try {
        // 在实际应用中，这里应该调用API获取数据
        // 这里使用模拟数据用于演示
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        projects.value = [
          {
            id: 1,
            title: '现代办公楼改造',
            description: '对现有办公建筑进行全面翻新，包括结构加固、内部空间重新规划、新增智能设施等。',
            location: '上海市浦东新区',
            startDate: '2023-05-10',
            endDate: '2023-12-15',
            status: 'inProgress',
            imageUrl: 'https://images.unsplash.com/photo-1556156653-e5a7668c3a2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 2,
            title: '高层住宅小区',
            description: '建设现代化高层住宅小区，包含20栋住宅楼，配套商业设施、公园及地下停车场。',
            location: '北京市朝阳区',
            startDate: '2022-09-01',
            endDate: '2024-06-30',
            status: 'inProgress',
            imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 3,
            title: '工业园区扩建',
            description: '对现有工业园区进行扩建，新增厂房、仓储设施及办公楼，改善内部交通及物流系统。',
            location: '广州市黄埔区',
            startDate: '2023-02-15',
            status: 'planning',
            imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 4,
            title: '商业综合体',
            description: '建设包含购物中心、办公楼及酒店的大型商业综合体，打造地标性建筑。',
            location: '深圳市福田区',
            startDate: '2022-03-20',
            endDate: '2023-11-10',
            status: 'completed',
            imageUrl: 'https://images.unsplash.com/photo-1557800261-33661373b3da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          }
        ];
      } catch (error) {
        console.error('获取项目数据失败:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    // 根据筛选条件过滤项目
    const filteredProjects = computed(() => {
      return projects.value.filter(project => {
        // 状态筛选
        const statusMatch = !filters.value.status || project.status === filters.value.status;
        
        // 搜索筛选
        const searchTerm = filters.value.search.toLowerCase();
        const searchMatch = !searchTerm || 
          project.title.toLowerCase().includes(searchTerm) || 
          project.description.toLowerCase().includes(searchTerm) ||
          project.location.toLowerCase().includes(searchTerm);
        
        return statusMatch && searchMatch;
      });
    });
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        planning: '规划中',
        inProgress: '进行中',
        completed: '已完成'
      };
      return statusMap[status] || '未知状态';
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '待定';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    };
    
    // 截断文本
    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    };
    
    // 查看项目详情
    const viewProjectDetails = (projectId) => {
      router.push(`/client/projects/${projectId}`);
    };
    
    // 组件挂载时获取数据
    onMounted(fetchProjects);
    
    return {
      projects,
      isLoading,
      filters,
      filteredProjects,
      getStatusText,
      formatDate,
      truncateText,
      viewProjectDetails
    };
  }
};
</script>

<style scoped lang="scss">
.client-projects {
  padding: 30px;
  
  .page-title {
    font-size: 28px;
    margin-bottom: 30px;
    font-weight: 700;
    color: #333;
  }
  
  .project-filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    
    .filter-group {
      label {
        margin-right: 10px;
        font-weight: 500;
      }
      
      select {
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
      }
    }
    
    .search-group {
      .search-input {
        padding: 10px 15px;
        width: 300px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        
        &:focus {
          border-color: #ffd700;
          outline: none;
        }
      }
    }
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    
    .loading-indicator,
    .no-projects {
      grid-column: 1 / -1;
      text-align: center;
      padding: 50px;
      font-size: 18px;
      color: #666;
    }
  }
  
  .project-card {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s, box-shadow 0.3s;
    background-color: #fff;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .project-image {
      height: 200px;
      position: relative;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
      
      .project-status {
        position: absolute;
        top: 15px;
        right: 15px;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        color: #fff;
        
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
    }
    
    .project-info {
      padding: 20px;
      
      .project-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 10px;
        color: #333;
      }
      
      .project-location {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        
        .location-icon {
          margin-right: 5px;
        }
      }
      
      .project-dates {
        font-size: 14px;
        color: #666;
        margin-bottom: 15px;
        
        .date-label {
          font-weight: 600;
          color: #333;
        }
      }
      
      .project-description {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
      }
    }
    
    .project-footer {
      padding: 0 20px 20px;
      text-align: right;
      
      .view-details-btn {
        padding: 8px 15px;
        background-color: #ffd700;
        color: #333;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s;
        
        &:hover {
          background-color: darken(#ffd700, 10%);
        }
      }
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .client-projects {
    padding: 20px;
    
    .project-filters {
      flex-direction: column;
      gap: 15px;
      
      .search-group {
        .search-input {
          width: 100%;
        }
      }
    }
    
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>