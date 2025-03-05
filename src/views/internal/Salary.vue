<template>
  <div class="salary-page">
    <div class="page-header">
      <h1>我的工资条</h1>
      <div class="period-selector">
        <select v-model="selectedPeriod" @change="loadSalaryData">
          <option v-for="period in availablePeriods" :key="period.id" :value="period.id">
            {{ period.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="salary-summary">
      <div class="summary-card total">
        <div class="card-label">实发工资</div>
        <div class="card-value">฿{{ formatNumber(salaryData.totalSalary) }}</div>
        <div class="card-trend" :class="salaryTrend.direction">
          <i :class="salaryTrend.icon"></i>
          <span>{{ salaryTrend.text }}</span>
        </div>
        <div class="card-date">{{ salaryData.payDate }}</div>
      </div>
      
      <div class="summary-card estimated">
        <div class="card-label">预计本月工资</div>
        <div class="card-value">฿{{ formatNumber(estimatedSalary) }}</div>
        <div class="card-note">含预计加班和奖励</div>
      </div>
    </div>

    <!-- 工资条核对信息 -->
    <div class="verify-section">
      <div class="verify-card">
        <h3>财务核对信息</h3>
        <div class="verify-item">
          <div class="verify-label">实际发放金额:</div>
          <div class="verify-value">฿{{ formatNumber(salaryData.totalSalary) }}</div>
        </div>
        <div class="verify-item">
          <div class="verify-label">收款人:</div>
          <div class="verify-value">{{ userStore.userName || '未知' }}</div>
        </div>
        <div class="verify-item">
          <div class="verify-label">工号:</div>
          <div class="verify-value">{{ userStore.employeeId || 'EMP-' + userStore.userId }}</div>
        </div>
        <div class="verify-item">
          <div class="verify-label">发放周期:</div>
          <div class="verify-value">{{ salaryData.periodType }} {{ salaryData.period }}</div>
        </div>
        <div class="verify-note">请确认以上信息与实际发放一致</div>
      </div>
    </div>

    <div class="salary-cards">
      <div class="salary-card income">
        <div class="card-header">
          <h2>收入项目 (半月结算)</h2>
          <div class="total-amount">฿{{ formatNumber(biweeklyIncome) }}</div>
        </div>
        <div class="card-content">
          <div class="salary-item">
            <div class="item-label">基本工资</div>
            <div class="item-value">฿{{ formatNumber(salaryData.baseSalary) }}</div>
          </div>
          <div class="salary-item">
            <div class="item-label">年限工资</div>
            <div class="item-value">฿{{ formatNumber(salaryData.yearsSalary) }}</div>
          </div>
        </div>
      </div>

      <div class="salary-card income monthly">
        <div class="card-header">
          <h2>奖励项 (月结算)</h2>
          <div class="total-amount">฿{{ formatNumber(monthlyIncome) }}</div>
        </div>
        <div class="card-content">
          <div class="salary-item">
            <div class="item-label">奖励</div>
            <div class="item-value">฿{{ formatNumber(salaryData.bonus) }}</div>
          </div>
          <div class="salary-item">
            <div class="item-label">加班费</div>
            <div class="item-value">฿{{ formatNumber(salaryData.overtimePay) }}</div>
          </div>
          <div class="salary-item">
            <div class="item-label">满勤奖</div>
            <div class="item-value">฿{{ formatNumber(salaryData.attendanceBonus) }}</div>
          </div>
        </div>
      </div>

      <div class="salary-card deduction">
        <div class="card-header">
          <h2>扣除项目</h2>
          <div class="total-amount">฿{{ formatNumber(totalDeduction) }}</div>
        </div>
        <div class="card-content">
          <div class="salary-item">
            <div class="item-label">个人所得税</div>
            <div class="item-value">฿{{ formatNumber(salaryData.tax) }}</div>
          </div>
          <div class="salary-item">
            <div class="item-label">社保</div>
            <div class="item-value">฿{{ formatNumber(salaryData.socialInsurance) }}</div>
          </div>
          <div class="salary-item">
            <div class="item-label">请假罚款</div>
            <div class="item-value">฿{{ formatNumber(salaryData.leavePenalty) }}</div>
          </div>
          <div class="salary-item">
            <div class="item-label">其他罚款</div>
            <div class="item-value">฿{{ formatNumber(salaryData.otherPenalty) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细工资记录表格 -->
    <div class="salary-details">
      <h2>本期工资明细</h2>
      <table class="salary-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>工作时长</th>
            <th>工作类型</th>
            <th>日薪</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in salaryData.dailyRecords" :key="index">
            <td>{{ record.date }}</td>
            <td>{{ record.hours }} 小时</td>
            <td>{{ record.type }}</td>
            <td>฿{{ formatNumber(record.dailyPay) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 工资条备注 -->
    <div class="salary-notes">
      <h3>备注说明</h3>
      <p>{{ salaryData.notes || '无' }}</p>
    </div>

    <!-- 底部操作区 -->
    <div class="salary-actions">
      <button class="action-btn" @click="printSalary">
        <i class="fas fa-print"></i> 打印工资条
      </button>
      <button class="action-btn" @click="downloadPDF">
        <i class="fas fa-download"></i> 下载PDF
      </button>
    </div>

    <!-- 历史工资查询 -->
    <div class="salary-history">
      <h3>历史工资记录</h3>
      <div class="history-list">
        <div class="history-item" v-for="(history, index) in salaryHistory" :key="index" @click="selectHistorySalary(history.id)">
          <div class="history-period">{{ history.periodType }} {{ history.period }}</div>
          <div class="history-amount">฿{{ formatNumber(history.amount) }}</div>
          <div class="history-status" :class="history.status">{{ history.statusText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../../store/userStore'

export default {
  name: 'SalaryView',

  setup() {
    const userStore = useUserStore()
    const selectedPeriod = ref('202310B') // 默认选择当前月的下半月
    
    // 可选工资周期 - 按半月划分
    const availablePeriods = ref([
      { id: '202310B', label: '2023年10月下半月 (16-31日)' },
      { id: '202310A', label: '2023年10月上半月 (1-15日)' },
      { id: '202309B', label: '2023年9月下半月 (16-30日)' },
      { id: '202309A', label: '2023年9月上半月 (1-15日)' },
      { id: '202308B', label: '2023年8月下半月 (16-31日)' },
      { id: '202308A', label: '2023年8月上半月 (1-15日)' },
    ])
    
    // 工资数据
    const salaryData = ref({
      period: '2023年10月',
      periodType: '下半月',
      payDate: '2023-11-01',
      baseSalary: 3000, // 半月基本工资
      yearsSalary: 300, // 半月年限工资
      bonus: 1200, // 月度奖励(每月发放一次，在下半月工资中体现)
      overtimePay: 850, // 月度加班费(每月发放一次，在下半月工资中体现)  
      attendanceBonus: 300, // 月度满勤奖(每月发放一次，在下半月工资中体现)
      tax: 150, // 税费
      socialInsurance: 480, // 社保
      leavePenalty: 100, // 请假罚款
      otherPenalty: 75, // 其他罚款
      totalSalary: 4845, // 实发工资 = 所有收入 - 所有扣除
      notes: '本月满勤奖及加班费已发放。',
      dailyRecords: [
        { date: '2023-10-16', hours: 8, type: '正常工作', dailyPay: 200 },
        { date: '2023-10-17', hours: 8, type: '正常工作', dailyPay: 200 },
        { date: '2023-10-18', hours: 12, type: '加班4小时(半天)', dailyPay: 400 },
        { date: '2023-10-19', hours: 10, type: '加班2小时', dailyPay: 300 },
        { date: '2023-10-20', hours: 16, type: '加班8小时(全天)', dailyPay: 600 },
        // 更多记录...
      ]
    })
    
    // 历史工资记录
    const salaryHistory = ref([
      { id: '202310A', period: '2023年10月', periodType: '上半月', amount: 2820, status: 'paid', statusText: '已发放' },
      { id: '202309B', period: '2023年9月', periodType: '下半月', amount: 4650, status: 'paid', statusText: '已发放' },
      { id: '202309A', period: '2023年9月', periodType: '上半月', amount: 2850, status: 'paid', statusText: '已发放' },
      { id: '202308B', period: '2023年8月', periodType: '下半月', amount: 4720, status: 'paid', statusText: '已发放' },
      { id: '202308A', period: '2023年8月', periodType: '上半月', amount: 2800, status: 'paid', statusText: '已发放' },
      { id: '202307B', period: '2023年7月', periodType: '下半月', amount: 4830, status: 'paid', statusText: '已发放' },
    ])
    
    // 计算半月结算收入总和
    const biweeklyIncome = computed(() => {
      return salaryData.value.baseSalary + 
             salaryData.value.yearsSalary
    })
    
    // 计算月结算收入总和
    const monthlyIncome = computed(() => {
      return salaryData.value.bonus + 
             salaryData.value.overtimePay + 
             salaryData.value.attendanceBonus
    })
    
    // 计算收入总和
    const totalIncome = computed(() => {
      return biweeklyIncome.value + monthlyIncome.value
    })
    
    // 计算扣除总和
    const totalDeduction = computed(() => {
      return salaryData.value.tax + 
             salaryData.value.socialInsurance + 
             salaryData.value.leavePenalty + 
             salaryData.value.otherPenalty
    })
    
    // 计算单日加班费用
    const calculateOvertimePay = (hours) => {
      // 不到2小时不算加班
      if (hours <= 10) {
        return 0;
      }
      // 加班时间
      const overtimeHours = hours - 8;
      
      // 超过8小时加班
      if (overtimeHours >= 8) {
        return 400;
      }
      // 超过4小时加班
      if (overtimeHours >= 4) {
        return 200;
      }
      // 其他情况按每小时计算
      return overtimeHours * 50;
    };
    
    // 预计本月工资 - 根据当前工资和预计加班、奖励等计算
    const estimatedSalary = computed(() => {
      // 基础工资部分
      const baseAmount = salaryData.value.baseSalary + salaryData.value.yearsSalary;
      
      // 如果是上半月，预计下半月会有加班
      let estimatedOvertime = salaryData.value.overtimePay;
      if (salaryData.value.periodType === '上半月') {
        // 预计下半月有4次半天加班(200*4=800)和2次全天加班(400*2=800)
        estimatedOvertime = 1600;
      } else {
        // 下半月已经有加班记录，预计再增加20%
        estimatedOvertime = estimatedOvertime * 1.2;
      }
      
      // 预计奖励部分 - 实际项目中可根据绩效预估
      const estimatedBonus = salaryData.value.bonus * 1.1; // 假设奖励会增加10%
      
      // 其他固定部分
      const otherAmount = salaryData.value.attendanceBonus;
      
      // 扣除部分
      const deductions = salaryData.value.tax + 
                         salaryData.value.socialInsurance + 
                         salaryData.value.leavePenalty + 
                         salaryData.value.otherPenalty;
      
      return baseAmount + estimatedOvertime + estimatedBonus + otherAmount - deductions;
    });
    
    // 工资趋势 - 判断工资是上升还是下降
    const salaryTrend = computed(() => {
      // 在实际项目中，可以通过比较上个月同期工资或同比增长来判断
      // 这里使用简化的逻辑：根据加班费和请假罚款判断
      
      if (salaryData.value.overtimePay > 500 && salaryData.value.leavePenalty === 0) {
        // 加班多且没有请假 - 上升
        return {
          direction: 'up',
          icon: 'fas fa-arrow-up',
          text: '加班多且全勤'
        };
      } else if (salaryData.value.overtimePay < 300 && salaryData.value.leavePenalty > 0) {
        // 加班少且有请假 - 下降
        return {
          direction: 'down',
          icon: 'fas fa-arrow-down',
          text: '加班少且有请假'
        };
      } else {
        // 其他情况 - 持平
        return {
          direction: 'stable',
          icon: 'fas fa-minus',
          text: '工资稳定'
        };
      }
    });
    
    // 格式化数字为两位小数
    const formatNumber = (num) => {
      return num.toFixed(2)
    }
    
    // 加载工资数据
    const loadSalaryData = () => {
      // 实际项目中，这里应该调用API获取选定周期的工资数据
      console.log('加载工资周期:', selectedPeriod.value)
      
      // 解析周期ID
      const year = selectedPeriod.value.substring(0, 4)
      const month = selectedPeriod.value.substring(4, 6)
      const halfMonth = selectedPeriod.value.substring(6, 7) // A表示上半月，B表示下半月
      
      const periodStr = `${year}年${month}月`
      const periodTypeStr = halfMonth === 'A' ? '上半月' : '下半月'
      
      // 模拟数据加载（实际项目中应通过API获取数据）
      if (selectedPeriod.value === '202310A') {
        // 上半月数据 - 没有月度奖金类项目
        salaryData.value = {
          period: periodStr,
          periodType: periodTypeStr,
          payDate: '2023-10-16',
          baseSalary: 3000,
          yearsSalary: 300,
          bonus: 0, // 上半月无月度奖励
          overtimePay: 0, // 上半月无月度加班费
          attendanceBonus: 0, // 上半月无月度满勤奖
          tax: 130,
          socialInsurance: 480,
          leavePenalty: 0,
          otherPenalty: 0,
          totalSalary: 2690, // 3000 + 300 - 130 - 480
          notes: '上半月工资，月度奖励项将在下半月发放。',
          dailyRecords: [
            { date: '2023-10-01', hours: 8, type: '正常工作', dailyPay: 200 },
            { date: '2023-10-02', hours: 9, type: '加班1小时(不计)', dailyPay: 200 },
            { date: '2023-10-03', hours: 11, type: '加班3小时', dailyPay: 350 }, // 基本200 + 加班3小时150
            // 更多记录...
          ]
        }
      } else if (selectedPeriod.value === '202310B') {
        // 下半月数据 - 包含月度奖金类项目
        salaryData.value = {
          period: periodStr,
          periodType: periodTypeStr,
          payDate: '2023-11-01',
          baseSalary: 3000,
          yearsSalary: 300,
          bonus: 1200, // 整月的奖励在下半月发放
          overtimePay: 850, // 整月的加班费在下半月发放
          attendanceBonus: 300, // 整月的满勤奖在下半月发放
          tax: 150,
          socialInsurance: 480,
          leavePenalty: 100,
          otherPenalty: 75,
          totalSalary: 4845, // 3000 + 300 + 1200 + 850 + 300 - 150 - 480 - 100 - 75
          notes: '本月满勤奖及加班费已发放。',
          dailyRecords: [
            { date: '2023-10-16', hours: 8, type: '正常工作', dailyPay: 200 },
            { date: '2023-10-17', hours: 8, type: '正常工作', dailyPay: 200 },
            { date: '2023-10-18', hours: 12, type: '加班4小时(半天)', dailyPay: 400 },
            { date: '2023-10-19', hours: 10, type: '加班2小时', dailyPay: 300 },
            { date: '2023-10-20', hours: 16, type: '加班8小时(全天)', dailyPay: 600 },
            // 更多记录...
          ]
        }
      } else if (selectedPeriod.value === '202309A') {
        // 2023年9月上半月
        salaryData.value = {
          period: periodStr,
          periodType: periodTypeStr,
          payDate: '2023-09-16',
          baseSalary: 3000,
          yearsSalary: 300,
          bonus: 0,
          overtimePay: 0,
          attendanceBonus: 0,
          tax: 130,
          socialInsurance: 480,
          leavePenalty: 0,
          otherPenalty: 0,
          totalSalary: 2690,
          notes: '上半月工资，月度奖励项将在下半月发放。',
          dailyRecords: [
            { date: '2023-09-01', hours: 8, type: '正常工作', dailyPay: 200 },
            { date: '2023-09-02', hours: 8, type: '正常工作', dailyPay: 200 },
            // 更多记录...
          ]
        }
      } else if (selectedPeriod.value === '202309B') {
        // 2023年9月下半月
        salaryData.value = {
          period: periodStr,
          periodType: periodTypeStr,
          payDate: '2023-10-01',
          baseSalary: 3000,
          yearsSalary: 300,
          bonus: 900,
          overtimePay: 750,
          attendanceBonus: 300,
          tax: 140,
          socialInsurance: 480,
          leavePenalty: 0,
          otherPenalty: 0,
          totalSalary: 4630,
          notes: '本月工作表现良好，发放团队奖金。',
          dailyRecords: [
            { date: '2023-09-16', hours: 8, type: '正常工作', dailyPay: 200 },
            { date: '2023-09-17', hours: 8, type: '正常工作', dailyPay: 200 },
            { date: '2023-09-18', hours: 9, type: '加班', dailyPay: 250 },
            // 更多记录...
          ]
        }
      }
    }
    
    // 选择历史工资记录
    const selectHistorySalary = (periodId) => {
      selectedPeriod.value = periodId
      loadSalaryData()
      // 平滑滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    
    // 打印工资条
    const printSalary = () => {
      window.print()
    }
    
    // 下载PDF
    const downloadPDF = () => {
      // 实际项目中应调用PDF生成和下载功能
      alert('此功能将在实际项目中实现PDF生成和下载')
    }
    
    onMounted(() => {
      // 加载初始工资数据
      loadSalaryData()
      
      // 这里可以添加从API获取可用工资周期的逻辑
    })
    
    return {
      userStore,
      selectedPeriod,
      availablePeriods,
      salaryData,
      salaryHistory,
      biweeklyIncome,
      monthlyIncome,
      totalIncome,
      totalDeduction,
      estimatedSalary,
      salaryTrend,
      formatNumber,
      loadSalaryData,
      selectHistorySalary,
      printSalary,
      downloadPDF
    }
  }
}
</script>

<style scoped>
.salary-page {
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

.period-selector select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background-color: white;
  font-size: 1rem;
  color: #2c3e50;
  cursor: pointer;
}

/* 工资总结 */
.salary-summary {
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  background-color: #3498db;
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.summary-card.estimated {
  background-color: #9b59b6; /* 紫色背景区分预计工资 */
}

.card-label {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.card-date {
  font-size: 0.9rem;
  opacity: 0.8;
}

.card-note {
  font-size: 0.9rem;
  opacity: 0.8;
  font-style: italic;
}

.card-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.card-trend.up {
  color: #ff5252; /* 红色表示上升 */
}

.card-trend.down {
  color: #2196f3; /* 蓝色表示下降 */
}

.card-trend.stable {
  color: #ffffff; /* 白色表示稳定 */
}

/* 核对信息 */
.verify-section {
  margin-bottom: 1.5rem;
}

.verify-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #f39c12;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.verify-card h3 {
  margin: 0 0 1rem 0;
  color: #f39c12;
  font-size: 1.1rem;
}

.verify-item {
  display: flex;
  margin-bottom: 0.75rem;
}

.verify-label {
  font-weight: 600;
  color: #7f8c8d;
  width: 140px;
}

.verify-value {
  color: #2c3e50;
  font-weight: 600;
}

.verify-note {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #e0e0e0;
  color: #e67e22;
  font-size: 0.9rem;
  font-style: italic;
}

/* 工资卡片 */
.salary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.salary-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h2 {
  font-size: 1.1rem;
  margin: 0;
  color: #2c3e50;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: 600;
}

.income .total-amount {
  color: #2ecc71;
}

.income.monthly .total-amount {
  color: #27ae60;
}

.deduction .total-amount {
  color: #e74c3c;
}

.card-content {
  padding: 1rem 1.5rem;
}

.salary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px dashed #f0f0f0;
}

.salary-item:last-child {
  border-bottom: none;
}

.item-label {
  color: #7f8c8d;
}

.item-value {
  font-weight: 600;
  color: #2c3e50;
}

/* 详细工资记录 */
.salary-details {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.salary-details h2 {
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.salary-table {
  width: 100%;
  border-collapse: collapse;
}

.salary-table th,
.salary-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.salary-table th {
  font-weight: 600;
  color: #2c3e50;
  background-color: #f8f9fa;
}

.salary-table tr:last-child td {
  border-bottom: none;
}

/* 工资条备注 */
.salary-notes {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #3498db;
}

.salary-notes h3 {
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
}

.salary-notes p {
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
}

/* 底部操作区 */
.salary-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3498db;
  color: white;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #2980b9;
}

.action-btn i {
  margin-right: 0.5rem;
}

/* 历史工资记录 */
.salary-history {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.salary-history h3 {
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.history-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.history-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.history-period {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.history-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.history-status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.history-status.paid {
  background-color: #e6f7ef;
  color: #2ecc71;
}

.history-status.pending {
  background-color: #fef5e7;
  color: #f39c12;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .salary-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .period-selector {
    margin-top: 1rem;
    width: 100%;
  }
  
  .period-selector select {
    width: 100%;
  }
  
  .salary-cards {
    grid-template-columns: 1fr;
  }
  
  .salary-table {
    display: block;
    overflow-x: auto;
  }
  
  .salary-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .history-list {
    grid-template-columns: 1fr;
  }
}

/* 打印样式 */
@media print {
  .salary-page {
    background-color: white;
    padding: 0;
  }
  
  .period-selector,
  .salary-actions,
  .salary-history {
    display: none;
  }
  
  .salary-card,
  .salary-details,
  .salary-notes,
  .verify-card {
    box-shadow: none;
    margin-bottom: 1rem;
    page-break-inside: avoid;
  }
  
  .salary-cards {
    display: block;
  }
  
  .salary-card {
    margin-bottom: 1.5rem;
  }
}
</style> 