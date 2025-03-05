<template>
  <div class="client-workflow">
    <div class="header">
      <div class="user-info">
        <h1>{{ userData?.name || '客户' }}的工作台</h1>
        <p>欢迎回来，今天是 {{ currentDate }}</p>
      </div>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
    
    <div class="workflow-grid">
      <!-- 项目进度卡片 -->
      <div class="workflow-card">
        <div class="card-header">
          <h2>项目进度</h2>
          <span class="badge">{{ projectProgress.length }}个项目</span>
        </div>
        <div class="card-content">
          <div v-if="projectProgress.length > 0">
            <div class="progress-item" v-for="project in projectProgress" :key="project.id">
              <div class="project-info">
                <h3>{{ project.name }}</h3>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{width: project.progress + '%'}"></div>
                </div>
                <div class="progress-text">
                  <span>{{ project.progress }}% 完成</span>
                  <span>{{ project.endDate }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>暂无进行中的项目</p>
          </div>
        </div>
        <div class="card-footer">
          <span class="update-info">最近更新: 今天 10:30</span>
          <button class="action-button" @click="navigateTo('projects')">查看全部</button>
        </div>
      </div>
      
      <!-- 临时施工卡片 -->
      <div class="workflow-card">
        <div class="card-header">
          <h2>临时施工</h2>
          <span class="notification">{{ pendingTempWorks }}个待审核</span>
        </div>
        <div class="card-content">
          <div class="temp-work-list">
            <div class="temp-work-item" v-for="work in tempWorks" :key="work.id">
              <div class="work-info">
                <span class="work-title">{{ work.title }}</span>
                <span class="work-status" :class="work.status">{{ work.statusText }}</span>
              </div>
              <div class="work-date">申请日期: {{ work.date }}</div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="action-button primary" @click="navigateTo('tempWorks')">申请临时施工</button>
        </div>
      </div>
      
      <!-- 维修申请卡片 -->
      <div class="workflow-card">
        <div class="card-header">
          <h2>维修申请</h2>
          <span class="notification">{{ pendingRepairs }}个未处理</span>
        </div>
        <div class="card-content">
          <div class="repair-stats">
            <div class="stat-item">
              <div class="stat-value">{{ repairStats.pending }}</div>
              <div class="stat-label">待处理</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ repairStats.inProgress }}</div>
              <div class="stat-label">处理中</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ repairStats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="action-button primary" @click="navigateTo('repairs')">提交维修申请</button>
        </div>
      </div>
      
      <!-- 报价确认卡片 -->
      <div class="workflow-card">
        <div class="card-header">
          <h2>报价确认</h2>
          <span class="notification">{{ pendingQuotes }}个待确认</span>
        </div>
        <div class="card-content">
          <div class="quote-list">
            <div class="quote-item" v-for="quote in quotes" :key="quote.id">
              <div class="quote-info">
                <span class="quote-title">{{ quote.title }}</span>
                <span class="quote-amount">¥{{ quote.amount.toLocaleString() }}</span>
              </div>
              <div class="quote-status" :class="quote.status">{{ quote.statusText }}</div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="action-button" @click="navigateTo('quotes')">查看全部报价</button>
        </div>
      </div>
      
      <!-- 回执确认卡片 -->
      <div class="workflow-card">
        <div class="card-header">
          <h2>回执确认</h2>
          <span class="notification">{{ pendingReceipts }}个待确认</span>
        </div>
        <div class="card-content">
          <div class="receipt-list">
            <div class="receipt-item" v-for="receipt in receipts" :key="receipt.id">
              <div class="receipt-info">
                <span class="receipt-title">{{ receipt.title }}</span>
                <span class="receipt-date">{{ receipt.date }}</span>
              </div>
              <div class="receipt-status" :class="receipt.status">{{ receipt.statusText }}</div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="action-button" @click="navigateTo('receipts')">查看全部回执</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/userStore';

export default {
  name: 'ClientWorkflow',
  
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    
    // 用户信息
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const userRole = computed(() => userStore.userRole);
    const userData = computed(() => userStore.userData);
    
    // 检查用户是否已认证且角色正确
    onMounted(() => {
      try {
        // 检查会话是否有效，如果存储中没有，尝试恢复会话
        if (!userStore.isAuthenticated) {
          const sessionRestored = userStore.checkSession();
        }
        
        // 再次检查认证状态
        if (!userStore.isAuthenticated) {
          router.push('/login');
          return;
        }
        
        // 检查用户角色
        if (userStore.userRole !== 'client') {
          if (userStore.userRole === 'admin') {
            router.push('/admin/dashboard');
          } else if (userStore.userRole === 'staff') {
            router.push('/internal/workspace');
          } else {
            router.push('/');
          }
          return;
        }
      } catch (error) {
        router.push('/login');
      }
    });

    // 当前日期
    const currentDate = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    // 项目进度数据
    const projectProgress = ref([
      {
        id: 1,
        name: '办公楼装修工程',
        progress: 75,
        startDate: '2023-01-15',
        endDate: '2023-05-30'
      },
      {
        id: 2,
        name: '会议室改造项目',
        progress: 40,
        startDate: '2023-03-10',
        endDate: '2023-06-15'
      }
    ]);

    // 临时施工数据
    const tempWorks = ref([
      {
        id: 1,
        title: '电路改造',
        date: '2023-04-10',
        status: 'pending',
        statusText: '待审核'
      },
      {
        id: 2,
        title: '安装新空调',
        date: '2023-04-05',
        status: 'approved',
        statusText: '已批准'
      },
      {
        id: 3,
        title: '墙面粉刷',
        date: '2023-03-28',
        status: 'completed',
        statusText: '已完成'
      }
    ]);

    // 维修统计
    const repairStats = ref({
      pending: 3,
      inProgress: 2,
      completed: 8
    });

    // 报价数据
    const quotes = ref([
      {
        id: 1,
        title: '办公室扩建工程',
        amount: 158000,
        status: 'pending',
        statusText: '待确认'
      },
      {
        id: 2,
        title: '绿化改造',
        amount: 36500,
        status: 'confirmed',
        statusText: '已确认'
      }
    ]);

    // 回执数据
    const receipts = ref([
      {
        id: 1,
        title: '消防系统检查',
        date: '2023-04-08',
        status: 'pending',
        statusText: '待确认'
      },
      {
        id: 2,
        title: '门禁系统安装',
        date: '2023-03-25',
        status: 'confirmed',
        statusText: '已确认'
      }
    ]);

    // 计算待处理数量
    const pendingTempWorks = computed(() => {
      return tempWorks.value.filter(work => work.status === 'pending').length;
    });

    const pendingRepairs = computed(() => repairStats.value.pending);

    const pendingQuotes = computed(() => {
      return quotes.value.filter(quote => quote.status === 'pending').length;
    });

    const pendingReceipts = computed(() => {
      return receipts.value.filter(receipt => receipt.status === 'pending').length;
    });

    // 页面导航
    const navigateTo = (page) => {
      router.push(`/client/${page}`);
    };

    // 登出
    const handleLogout = () => {
      userStore.logout();
      router.push('/login');
    };

    return {
      currentDate,
      projectProgress,
      tempWorks,
      repairStats,
      quotes,
      receipts,
      pendingTempWorks,
      pendingRepairs,
      pendingQuotes,
      pendingReceipts,
      navigateTo,
      handleLogout,
      isAuthenticated,
      userRole,
      userData
    };
  }
}
</script>

<style scoped>
.client-workflow {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.user-info h1 {
  margin: 0 0 5px 0;
  font-size: 24px;
  color: #333;
}

.user-info p {
  margin: 0;
  color: #666;
}

.logout-btn {
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  color: #f56c6c;
  border-color: #f56c6c;
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.workflow-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.badge {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.notification {
  background-color: #fff2e8;
  color: #fa8c16;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.card-content {
  padding: 20px;
  flex-grow: 1;
}

.card-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-button {
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.action-button.primary {
  background-color: #1890ff;
  color: white;
}

.action-button.primary:hover {
  background-color: #40a9ff;
}

.update-info {
  color: #999;
  font-size: 12px;
}

/* Project Progress Styles */
.progress-item {
  margin-bottom: 15px;
}

.progress-item:last-child {
  margin-bottom: 0;
}

.project-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.progress-bar {
  height: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background-color: #52c41a;
  border-radius: 4px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

/* Temp Work Styles */
.temp-work-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.temp-work-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.temp-work-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.work-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.work-title {
  font-weight: 500;
}

.work-status {
  font-size: 12px;
}

.work-date {
  font-size: 12px;
  color: #999;
}

.work-status.pending {
  color: #faad14;
}

.work-status.approved {
  color: #52c41a;
}

.work-status.completed {
  color: #1890ff;
}

/* Repair Stats Styles */
.repair-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  padding: 15px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

/* Quote Styles */
.quote-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quote-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.quote-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.quote-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.quote-title {
  font-weight: 500;
}

.quote-amount {
  font-weight: bold;
  color: #333;
}

.quote-status {
  font-size: 12px;
}

.quote-status.pending {
  color: #faad14;
}

.quote-status.confirmed {
  color: #52c41a;
}

/* Receipt Styles */
.receipt-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.receipt-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.receipt-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.receipt-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.receipt-title {
  font-weight: 500;
}

.receipt-date {
  font-size: 12px;
  color: #999;
}

.receipt-status {
  font-size: 12px;
}

.receipt-status.pending {
  color: #faad14;
}

.receipt-status.confirmed {
  color: #52c41a;
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999;
}

@media (max-width: 768px) {
  .workflow-grid {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .logout-btn {
    align-self: flex-end;
  }
}
</style> 