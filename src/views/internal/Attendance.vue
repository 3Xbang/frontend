<template>
  <div class="attendance-page">
    <div class="page-header">
      <h1>我的考勤记录</h1>
      <div class="month-selector">
        <select v-model="selectedMonth" @change="loadAttendanceData">
          <option v-for="month in availableMonths" :key="month.id" :value="month.id">
            {{ month.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- 考勤统计卡片 -->
    <div class="attendance-summary">
      <div class="summary-card normal">
        <div class="card-value">{{ attendanceStats.normalDays }}</div>
        <div class="card-label">正常出勤</div>
      </div>
      <div class="summary-card late">
        <div class="card-value">{{ attendanceStats.lateDays }}</div>
        <div class="card-label">迟到</div>
      </div>
      <div class="summary-card early">
        <div class="card-value">{{ attendanceStats.earlyDays }}</div>
        <div class="card-label">早退</div>
      </div>
      <div class="summary-card absent">
        <div class="card-value">{{ attendanceStats.absentDays }}</div>
        <div class="card-label">缺勤</div>
      </div>
      <div class="summary-card overtime">
        <div class="card-value">{{ attendanceStats.overtimeDays }}</div>
        <div class="card-label">加班</div>
      </div>
    </div>

    <!-- 月度考勤日历 -->
    <div class="attendance-calendar">
      <h2>{{ selectedMonth.substring(0, 4) }}年{{ selectedMonth.substring(4) }}月考勤日历</h2>
      <div class="calendar-header">
        <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>
      <div class="calendar-body">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index" 
          class="calendar-day" 
          :class="[
            { 'day-other-month': !day.currentMonth },
            { 'day-weekend': day.isWeekend },
            day.status
          ]"
        >
          <div class="day-number">{{ day.date }}</div>
          <div v-if="day.attendance" class="day-content">
            <div class="clock-in-time" v-if="day.attendance.clockIn">
              {{ day.attendance.clockIn }}
            </div>
            <div class="clock-out-time" v-if="day.attendance.clockOut">
              {{ day.attendance.clockOut }}
            </div>
            <div class="attendance-status" v-if="day.status">
              {{ statusLabels[day.status] }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细考勤记录 -->
    <div class="attendance-records">
      <h2>详细考勤记录</h2>
      <div class="record-filters">
        <select v-model="statusFilter">
          <option value="all">全部状态</option>
          <option value="normal">正常</option>
          <option value="late">迟到</option>
          <option value="early">早退</option>
          <option value="absent">缺勤</option>
          <option value="overtime">加班</option>
        </select>
      </div>
      <table class="records-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>星期</th>
            <th>上班打卡</th>
            <th>下班打卡</th>
            <th>工作时长</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.date" :class="record.status">
            <td>{{ record.date }}</td>
            <td>{{ record.weekday }}</td>
            <td>{{ record.clockIn || '-' }}</td>
            <td>{{ record.clockOut || '-' }}</td>
            <td>{{ record.workHours }}小时</td>
            <td>{{ statusLabels[record.status] }}</td>
            <td>{{ record.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 申请更正 -->
    <div class="correction-section">
      <h3>考勤异常？申请更正</h3>
      <div class="correction-form">
        <div class="form-group">
          <label>选择日期</label>
          <input type="date" v-model="correction.date" />
        </div>
        <div class="form-group">
          <label>更正类型</label>
          <select v-model="correction.type">
            <option value="clockIn">上班打卡</option>
            <option value="clockOut">下班打卡</option>
            <option value="absent">消除缺勤</option>
          </select>
        </div>
        <div class="form-group">
          <label>更正原因</label>
          <textarea v-model="correction.reason" placeholder="请详细说明原因..."></textarea>
        </div>
        <button class="submit-btn" @click="submitCorrection">提交申请</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../store/userStore';

export default {
  name: 'AttendanceView',
  
  setup() {
    const userStore = useUserStore();
    
    // 选择的月份
    const selectedMonth = ref('202310');
    
    // 可选月份列表
    const availableMonths = ref([
      { id: '202310', label: '2023年10月' },
      { id: '202309', label: '2023年9月' },
      { id: '202308', label: '2023年8月' },
      { id: '202307', label: '2023年7月' },
    ]);
    
    // 考勤记录
    const attendanceRecords = ref([]);
    
    // 状态过滤
    const statusFilter = ref('all');
    
    // 状态标签
    const statusLabels = {
      normal: '正常',
      late: '迟到',
      early: '早退',
      absent: '缺勤',
      overtime: '加班',
    };
    
    // 星期几
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    // 考勤统计
    const attendanceStats = ref({
      normalDays: 0,
      lateDays: 0,
      earlyDays: 0,
      absentDays: 0,
      overtimeDays: 0,
    });
    
    // 更正申请
    const correction = ref({
      date: '',
      type: 'clockIn',
      reason: '',
    });
    
    // 过滤后的记录
    const filteredRecords = computed(() => {
      if (statusFilter.value === 'all') {
        return attendanceRecords.value;
      }
      return attendanceRecords.value.filter(record => record.status === statusFilter.value);
    });
    
    // 日历天数
    const calendarDays = computed(() => {
      const year = parseInt(selectedMonth.value.substring(0, 4));
      const month = parseInt(selectedMonth.value.substring(4)) - 1; // 月份从0开始
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      
      // 获取第一天是星期几
      const firstDayWeekday = firstDay.getDay();
      
      // 创建日历数组
      const days = [];
      
      // 添加上个月的天数
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = 0; i < firstDayWeekday; i++) {
        const dayNumber = prevMonthLastDay - firstDayWeekday + i + 1;
        days.push({
          date: dayNumber,
          currentMonth: false,
          isWeekend: false,
          status: null,
          attendance: null
        });
      }
      
      // 添加本月的天数
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dateStr = formatDate(date);
        const weekday = date.getDay();
        const isWeekend = weekday === 0 || weekday === 6;
        
        // 查找该日期的考勤记录
        const record = attendanceRecords.value.find(r => r.date === dateStr);
        
        days.push({
          date: i,
          currentMonth: true,
          isWeekend: isWeekend,
          status: record ? record.status : (isWeekend ? null : 'absent'),
          attendance: record
        });
      }
      
      // 添加下个月的天数以填满六行
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: i,
          currentMonth: false,
          isWeekend: false,
          status: null,
          attendance: null
        });
      }
      
      return days;
    });
    
    // 格式化日期
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // 格式化日期时间
    const formatDateTime = (date, time) => {
      return `${date} ${time}`;
    };
    
    // 加载考勤数据
    const loadAttendanceData = () => {
      console.log('加载考勤数据:', selectedMonth.value);
      
      // 解析选中的年月
      const year = parseInt(selectedMonth.value.substring(0, 4));
      const month = parseInt(selectedMonth.value.substring(4));
      
      // 清空之前的数据
      attendanceRecords.value = [];
      
      // 生成当月的所有工作日
      const daysInMonth = new Date(year, month, 0).getDate();
      
      // 模拟数据
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const weekday = date.getDay();
        
        // 跳过周末
        if (weekday === 0 || weekday === 6) {
          continue;
        }
        
        const dateStr = formatDate(date);
        
        // 随机生成不同状态的考勤记录
        let status, clockIn, clockOut, workHours, note;
        
        // 模拟随机考勤状态
        const random = Math.random();
        
        if (random > 0.8) {
          // 20% 概率迟到
          status = 'late';
          clockIn = `08:${30 + Math.floor(Math.random() * 30)}`;
          clockOut = '17:30';
          workHours = 8;
          note = '迟到已记录';
        } else if (random > 0.65) {
          // 15% 概率早退
          status = 'early';
          clockIn = '08:00';
          clockOut = `${16 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 30)}`;
          workHours = 7;
          note = '早退已记录';
        } else if (random > 0.55) {
          // 10% 概率缺勤
          status = 'absent';
          clockIn = '-';
          clockOut = '-';
          workHours = 0;
          note = '未打卡';
        } else if (random > 0.35) {
          // 20% 概率加班
          status = 'overtime';
          clockIn = '08:00';
          clockOut = `${18 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60)}`;
          workHours = 9 + Math.floor(Math.random() * 3);
          note = `加班${workHours - 8}小时`;
        } else {
          // 35% 概率正常
          status = 'normal';
          clockIn = `0${7 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
          clockOut = `${17 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
          workHours = 8;
          note = '正常出勤';
        }
        
        attendanceRecords.value.push({
          date: dateStr,
          weekday: weekdays[weekday],
          clockIn,
          clockOut,
          workHours,
          status,
          note
        });
      }
      
      // 计算统计数据
      updateAttendanceStats();
    };
    
    // 更新考勤统计
    const updateAttendanceStats = () => {
      attendanceStats.value = {
        normalDays: attendanceRecords.value.filter(r => r.status === 'normal').length,
        lateDays: attendanceRecords.value.filter(r => r.status === 'late').length,
        earlyDays: attendanceRecords.value.filter(r => r.status === 'early').length,
        absentDays: attendanceRecords.value.filter(r => r.status === 'absent').length,
        overtimeDays: attendanceRecords.value.filter(r => r.status === 'overtime').length
      };
    };
    
    // 提交更正申请
    const submitCorrection = () => {
      console.log('提交考勤更正申请:', correction.value);
      
      // 实际项目中这里应该调用API提交申请
      alert(`已提交${correction.value.date}的考勤更正申请，请等待审核`);
      
      // 重置表单
      correction.value = {
        date: '',
        type: 'clockIn',
        reason: ''
      };
    };
    
    // 初始化
    onMounted(() => {
      // 默认加载当前月份
      loadAttendanceData();
    });
    
    return {
      userStore,
      selectedMonth,
      availableMonths,
      attendanceRecords,
      filteredRecords,
      statusFilter,
      statusLabels,
      weekdays,
      attendanceStats,
      correction,
      calendarDays,
      
      loadAttendanceData,
      submitCorrection
    };
  }
}
</script>

<style scoped>
.attendance-page {
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

.month-selector select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background-color: white;
  font-size: 1rem;
  color: #2c3e50;
  cursor: pointer;
}

/* 考勤统计卡片 */
.attendance-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

.summary-card.normal::before {
  background-color: #2ecc71;
}

.summary-card.late::before {
  background-color: #f39c12;
}

.summary-card.early::before {
  background-color: #3498db;
}

.summary-card.absent::before {
  background-color: #e74c3c;
}

.summary-card.overtime::before {
  background-color: #9b59b6;
}

.card-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.card-label {
  font-size: 1rem;
  color: #7f8c8d;
}

/* 月度考勤日历 */
.attendance-calendar {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.attendance-calendar h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  padding: 0.5rem;
  font-weight: 600;
  color: #7f8c8d;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 0.5rem;
  position: relative;
}

.day-number {
  font-weight: 600;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
}

.day-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-top: 1rem;
}

.clock-in-time,
.clock-out-time {
  font-size: 0.8rem;
  margin: 0.1rem 0;
}

.attendance-status {
  margin-top: 0.25rem;
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.05);
}

/* 状态样式 */
.calendar-day.normal {
  background-color: rgba(46, 204, 113, 0.1);
}

.calendar-day.late {
  background-color: rgba(243, 156, 18, 0.1);
}

.calendar-day.early {
  background-color: rgba(52, 152, 219, 0.1);
}

.calendar-day.absent {
  background-color: rgba(231, 76, 60, 0.1);
}

.calendar-day.overtime {
  background-color: rgba(155, 89, 182, 0.1);
}

.calendar-day.day-other-month {
  opacity: 0.3;
}

.calendar-day.day-weekend {
  background-color: #f8f9fa;
}

/* 详细考勤记录 */
.attendance-records {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.attendance-records h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.record-filters {
  margin-bottom: 1rem;
}

.record-filters select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background-color: white;
  font-size: 0.9rem;
  color: #2c3e50;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th,
.records-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.records-table th {
  font-weight: 600;
  color: #2c3e50;
  background-color: #f8f9fa;
}

.records-table tr:last-child td {
  border-bottom: none;
}

/* 行状态样式 */
.records-table tr.normal td {
  border-left: 3px solid #2ecc71;
}

.records-table tr.late td {
  border-left: 3px solid #f39c12;
}

.records-table tr.early td {
  border-left: 3px solid #3498db;
}

.records-table tr.absent td {
  border-left: 3px solid #e74c3c;
}

.records-table tr.overtime td {
  border-left: 3px solid #9b59b6;
}

/* 申请更正 */
.correction-section {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.correction-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.correction-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
</style> 