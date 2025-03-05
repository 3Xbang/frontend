<template>
  <div class="leave-page">
    <div class="page-header">
      <h1>请假申请</h1>
      <div class="user-info">
        <span>{{ userStore.userInfo ? userStore.userInfo.name : '用户' }}</span>
      </div>
    </div>

    <!-- 请假申请 -->
    <div class="leave-application-section">
      <p class="leave-rules">
        <i class="rule-icon">⚠️</i> 请假规则：提前4小时以上申请的请假自动生效；4小时内的请假需经审批后生效
      </p>

      <!-- 提示消息 -->
      <div v-if="leaveMessage.show" :class="['leave-message', leaveMessage.type]">
        {{ leaveMessage.text }}
        <span class="close-message" @click="closeLeaveMessage">×</span>
      </div>

      <div class="leave-form">
        <!-- 请假类型 -->
        <div class="form-group">
          <label>请假类型</label>
          <select v-model="leaveApplication.type">
            <option v-for="(label, value) in leaveTypeLabels" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </div>
        
        <!-- 请假日期和时间 -->
        <div class="form-row">
          <div class="form-group">
            <label>开始日期</label>
            <input type="date" v-model="leaveApplication.startDate" @change="onLeaveFormChange" />
          </div>
          <div class="form-group">
            <label>开始时间</label>
            <input type="time" v-model="leaveApplication.startTime" @change="onLeaveFormChange" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>结束日期</label>
            <input type="date" v-model="leaveApplication.endDate" @change="onLeaveFormChange" />
          </div>
          <div class="form-group">
            <label>结束时间</label>
            <input type="time" v-model="leaveApplication.endTime" @change="onLeaveFormChange" />
          </div>
        </div>
        
        <!-- 请假原因 -->
        <div class="form-group">
          <label>请假原因</label>
          <textarea v-model="leaveApplication.reason" placeholder="请详细说明请假原因..."></textarea>
        </div>
        
        <!-- 请假信息摘要 -->
        <div class="leave-summary">
          <div>请假时长：<span class="highlighted">{{ leaveHours }}</span> 小时</div>
          <div>申请状态：<span :class="['status-tag', leaveStatusClass]">{{ leaveStatusText }}</span></div>
        </div>
        
        <!-- 提交按钮 -->
        <button class="submit-btn" @click="handleLeaveSubmit" :disabled="!canSubmitLeave">
          {{ leaveButtonText }}
        </button>
      </div>
      
      <!-- 请假记录 -->
      <div class="leave-history" v-if="leaveHistory.length > 0">
        <h4>请假记录</h4>
        <table class="leave-history-table">
          <thead>
            <tr>
              <th>请假类型</th>
              <th>开始时间</th>
              <th>结束时间</th>
              <th>时长</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(leave, index) in leaveHistory" :key="index">
              <td>{{ leaveTypeLabels[leave.type] }}</td>
              <td>{{ leave.startDateTime }}</td>
              <td>{{ leave.endDateTime }}</td>
              <td>{{ leave.hours }}小时</td>
              <td><span :class="['status-tag', leave.statusClass]">{{ leave.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../store/userStore';

export default {
  name: 'LeaveView',
  
  setup() {
    const userStore = useUserStore();
    
    // 请假类型标签
    const leaveTypeLabels = {
      sick: '病假',
      personal: '事假', 
      annual: '年假',
      marriage: '婚假',
      maternity: '产假',
      funeral: '丧假'
    };
    
    // 请假申请
    const leaveApplication = ref({
      type: 'personal',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      reason: ''
    });
    
    // 请假消息提示
    const leaveMessage = ref({
      show: false,
      text: '',
      type: 'success'
    });
    
    // 计算请假时长
    const leaveHours = ref(0);
    
    // 请假历史记录
    const leaveHistory = ref([]);
    
    // 简化的请假状态
    const leaveStatusText = ref('请选择时间');
    const leaveStatusClass = ref('status-neutral');
    const leaveButtonText = ref('提交请假申请');
    
    // 判断是否可以提交请假
    const canSubmitLeave = computed(() => {
      return leaveApplication.value.startDate && 
             leaveApplication.value.startTime && 
             leaveApplication.value.endDate && 
             leaveApplication.value.endTime && 
             leaveApplication.value.reason && 
             leaveHours.value > 0 &&
             leaveStatusText.value !== '无法申请过去时间';
    });
    
    // 格式化日期时间
    const formatDateTime = (date, time) => {
      return `${date} ${time}`;
    };
    
    // 关闭请假消息提示
    const closeLeaveMessage = () => {
      leaveMessage.value.show = false;
    };
    
    // 处理请假表单变化
    const onLeaveFormChange = () => {
      // 重新计算请假时长
      calculateLeaveHours();
      
      // 更新请假状态
      updateLeaveStatus();
    };
    
    // 更新请假状态
    const updateLeaveStatus = () => {
      try {
        // 检查必填字段
        if (!leaveApplication.value.startDate || !leaveApplication.value.startTime) {
          leaveStatusText.value = '请选择时间';
          leaveStatusClass.value = 'status-neutral';
          leaveButtonText.value = '提交请假申请';
          return;
        }
        
        // 解析开始时间
        let startDateTime;
        try {
          // 使用更安全的方法解析日期
          const startDate = leaveApplication.value.startDate;
          const startTime = leaveApplication.value.startTime;
          const [year, month, day] = startDate.split('-').map(Number);
          const [hours, minutes] = startTime.split(':').map(Number);
          
          startDateTime = new Date(year, month - 1, day, hours, minutes);
          
          if (isNaN(startDateTime.getTime())) {
            throw new Error('Invalid date');
          }
        } catch (err) {
          console.error('Date parsing error:', err);
          leaveStatusText.value = '日期格式错误';
          leaveStatusClass.value = 'status-rejected';
          leaveButtonText.value = '提交请假申请';
          return;
        }
        
        // 检查是否过去时间
        const now = new Date();
        if (startDateTime < now) {
          leaveStatusText.value = '无法申请过去时间';
          leaveStatusClass.value = 'status-rejected';
          leaveButtonText.value = '提交请假申请';
          return;
        }
        
        // 计算时间差
        const timeDiff = startDateTime - now;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // 根据时差设置状态
        if (hoursDiff >= 4) {
          leaveStatusText.value = '自动批准';
          leaveStatusClass.value = 'status-approved';
          leaveButtonText.value = '提交请假申请';
        } else {
          leaveStatusText.value = '需要审批';
          leaveStatusClass.value = 'status-pending';
          leaveButtonText.value = '提交紧急请假审批';
        }
      } catch (error) {
        console.error('更新请假状态出错:', error);
        leaveStatusText.value = '状态计算错误';
        leaveStatusClass.value = 'status-neutral';
        leaveButtonText.value = '提交请假申请';
      }
    };
    
    // 请假申请处理
    const handleLeaveSubmit = () => {
      console.log('开始处理请假申请');
      
      try {
        // 如果不能提交，则直接返回
        if (!canSubmitLeave.value) {
          console.log('不满足提交条件');
          return;
        }
        
        console.log('创建请假记录');
        
        // 简单获取当前状态
        const isAutomaticallyApproved = leaveStatusText.value === '自动批准';
        
        // 创建新的请假记录
        const newLeave = {
          type: leaveApplication.value.type,
          startDateTime: `${leaveApplication.value.startDate} ${leaveApplication.value.startTime}`,
          endDateTime: `${leaveApplication.value.endDate} ${leaveApplication.value.endTime}`,
          hours: leaveHours.value,
          reason: leaveApplication.value.reason,
          status: isAutomaticallyApproved ? '已批准' : '审批中',
          statusClass: isAutomaticallyApproved ? 'status-approved' : 'status-pending'
        };
        
        console.log('新请假记录:', newLeave);
        
        // 更新请假历史
        const currentHistory = [...leaveHistory.value];
        currentHistory.unshift(newLeave);
        leaveHistory.value = currentHistory;
        
        console.log('请假历史已更新');
        
        // 显示成功消息
        leaveMessage.value = {
          show: true,
          text: isAutomaticallyApproved ? '请假申请已自动批准！' : '紧急请假申请已提交，请等待主管审批！',
          type: isAutomaticallyApproved ? 'success' : 'warning'
        };
        
        console.log('显示成功消息:', leaveMessage.value);
        
        // 重置表单
        resetLeaveForm();
        
        console.log('表单已重置');
        
        // 3秒后自动隐藏消息
        setTimeout(() => {
          leaveMessage.value.show = false;
        }, 3000);
      } catch (error) {
        console.error('请假申请处理出错:', error);
        
        // 显示错误消息
        leaveMessage.value = {
          show: true,
          text: '提交请假申请时出错，请重试: ' + (error.message || '未知错误'),
          type: 'error'
        };
      }
    };
    
    // 重置请假表单
    const resetLeaveForm = () => {
      // 获取今天的日期字符串
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      
      // 安全地重置表单
      leaveApplication.value = {
        type: 'personal',
        startDate: todayStr,
        endDate: todayStr,
        startTime: '',
        endTime: '',
        reason: ''
      };
      
      // 重置请假时长
      leaveHours.value = 0;
      
      // 重置状态
      leaveStatusText.value = '请选择时间';
      leaveStatusClass.value = 'status-neutral';
      leaveButtonText.value = '提交请假申请';
    };
    
    // 计算请假时长
    const calculateLeaveHours = () => {
      console.log('开始计算请假时长');
      
      try {
        // 检查必填字段
        if (!leaveApplication.value.startDate || !leaveApplication.value.startTime || 
            !leaveApplication.value.endDate || !leaveApplication.value.endTime) {
          leaveHours.value = 0;
          return;
        }
        
        console.log('解析日期和时间');
        
        // 解析开始和结束时间
        let startDateTime, endDateTime;
        try {
          // 使用更安全的方法解析日期
          const [startYear, startMonth, startDay] = leaveApplication.value.startDate.split('-').map(Number);
          const [startHours, startMinutes] = leaveApplication.value.startTime.split(':').map(Number);
          startDateTime = new Date(startYear, startMonth - 1, startDay, startHours, startMinutes);
          
          const [endYear, endMonth, endDay] = leaveApplication.value.endDate.split('-').map(Number);
          const [endHours, endMinutes] = leaveApplication.value.endTime.split(':').map(Number);
          endDateTime = new Date(endYear, endMonth - 1, endDay, endHours, endMinutes);
          
          if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            throw new Error('Invalid date');
          }
        } catch (err) {
          console.error('日期解析错误:', err);
          leaveHours.value = 0;
          return;
        }
        
        console.log('开始日期时间:', startDateTime);
        console.log('结束日期时间:', endDateTime);
        
        // 结束时间应晚于开始时间
        if (endDateTime <= startDateTime) {
          console.log('结束时间不晚于开始时间');
          leaveHours.value = 0;
          return;
        }
        
        // 简化计算请假时长的逻辑
        let totalHours = 0;
        
        // 总时间差（毫秒）
        const timeDiff = endDateTime - startDateTime;
        
        // 转换为小时
        const rawHours = timeDiff / (1000 * 60 * 60);
        
        // 简单处理：只考虑工作时间（9:00-18:00）和午休（12:00-13:00）
        // 这里简化为总时间的70%作为工作时间（假设30%的时间是非工作时间）
        totalHours = rawHours * 0.7;
        
        // 四舍五入到一位小数
        leaveHours.value = Math.round(totalHours * 10) / 10;
        
        console.log('计算得到请假时长:', leaveHours.value);
      } catch (error) {
        console.error('计算请假时长出错:', error);
        leaveHours.value = 0;
      }
    };
    
    // 加载请假历史
    const loadLeaveHistory = () => {
      // 模拟请假历史数据
      leaveHistory.value = [
        {
          type: 'sick',
          startDateTime: '2023-10-05 09:00',
          endDateTime: '2023-10-06 18:00',
          hours: 16,
          status: '已批准',
          statusClass: 'status-approved'
        },
        {
          type: 'personal',
          startDateTime: '2023-10-12 14:00',
          endDateTime: '2023-10-12 18:00',
          hours: 4,
          status: '已批准',
          statusClass: 'status-approved'
        },
        {
          type: 'personal',
          startDateTime: '2023-10-18 09:00',
          endDateTime: '2023-10-18 12:00',
          hours: 3,
          status: '审批中',
          statusClass: 'status-pending'
        }
      ];
    };
    
    // 初始化
    onMounted(() => {
      // 加载请假历史
      loadLeaveHistory();
      
      // 设置默认请假日期为今天
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        
        leaveApplication.value.startDate = todayStr;
        leaveApplication.value.endDate = todayStr;
      } catch (error) {
        console.error('初始化日期出错:', error);
      }
    });
    
    return {
      userStore,
      leaveTypeLabels,
      leaveApplication,
      leaveHours,
      leaveStatusText,
      leaveStatusClass,
      leaveButtonText,
      canSubmitLeave,
      leaveHistory,
      leaveMessage,
      
      onLeaveFormChange,
      handleLeaveSubmit,
      closeLeaveMessage
    };
  }
}
</script>

<style scoped>
.leave-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin: 0;
}

.user-info {
  font-size: 1rem;
  color: #7f8c8d;
}

/* 请假申请 */
.leave-application-section {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.leave-rules {
  background-color: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.rule-icon {
  margin-right: 0.5rem;
  font-style: normal;
}

.leave-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background-color: #f8f9fa;
  font-size: 0.9rem;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.leave-summary {
  grid-column: 1 / -1;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.highlighted {
  font-weight: 700;
  color: #3498db;
}

.status-tag {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-approved {
  background-color: rgba(46, 204, 113, 0.2);
  color: #27ae60;
}

.status-pending {
  background-color: rgba(241, 196, 15, 0.2);
  color: #f39c12;
}

.status-rejected {
  background-color: rgba(231, 76, 60, 0.2);
  color: #c0392b;
}

.status-neutral {
  background-color: rgba(189, 195, 199, 0.2);
  color: #7f8c8d;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

/* 请假历史 */
.leave-history {
  margin-top: 2rem;
}

.leave-history h4 {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.leave-history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.leave-history-table th,
.leave-history-table td {
  padding: 0.6rem;
  border-bottom: 1px solid #f0f0f0;
}

.leave-history-table th {
  font-weight: 600;
  color: #2c3e50;
  background-color: #f8f9fa;
  text-align: left;
}

/* 请假消息提示 */
.leave-message {
  padding: 12px 16px;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  position: relative;
  font-size: 0.95rem;
  animation: fadeIn 0.3s ease-in-out;
}

.leave-message.success {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border-left: 4px solid #27ae60;
}

.leave-message.warning {
  background-color: rgba(241, 196, 15, 0.15);
  color: #f39c12;
  border-left: 4px solid #f39c12;
}

.leave-message.error {
  background-color: rgba(231, 76, 60, 0.15);
  color: #c0392b;
  border-left: 4px solid #c0392b;
}

.close-message {
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.7;
}

.close-message:hover {
  opacity: 1;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .leave-page {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .leave-summary {
    flex-direction: column;
  }
  
  .leave-history-table {
    display: block;
    overflow-x: auto;
  }
}
</style> 