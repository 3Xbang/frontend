<template>
  <div class="internal-workspace">
    <!-- 顶部信息与功能区 -->
    <div class="workspace-header">
      <div class="time-info">
        <div class="current-time">{{ currentTime }}</div>
        <div class="date-info">
          <span class="current-date">{{ currentDate }}</span>
          <span class="lunar-date">{{ lunarDate }}</span>
        </div>
      </div>
      <div class="user-info">
        <span class="user-welcome">欢迎回来，{{ userFullName }}</span>
        <div class="user-avatar">
          <img src="../assets/images/avatar-placeholder.png" alt="用户头像" v-if="!userAvatarUrl">
          <img :src="userAvatarUrl" alt="用户头像" v-else>
        </div>
      </div>
    </div>

    <!-- 打卡按钮区域 -->
    <div class="clock-actions">
      <button 
        class="clock-btn clock-in" 
        :class="{'disabled': isClockedIn || !isWorkTime}" 
        @click="showClockInProcess"
        :disabled="isClockedIn || !isWorkTime"
      >
        <i class="fas fa-sign-in-alt"></i>
        <span>开工打卡</span>
      </button>
      <button 
        class="clock-btn clock-out" 
        :class="{'disabled': !isClockedIn}" 
        @click="showClockOutProcess"
        :disabled="!isClockedIn"
      >
        <i class="fas fa-sign-out-alt"></i>
        <span>收工打卡</span>
      </button>
    </div>
    
    <!-- 测试按钮 -->
    <div class="test-buttons" style="margin-bottom: 1rem; text-align: center;">
      <button 
        style="background-color: #3498db; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer;"
        @click="testClockIn"
      >
        测试开工打卡功能
      </button>
    </div>

    <!-- 开工打卡流程弹窗 -->
    <div class="modal-overlay" v-if="showClockInModal" @click.self="cancelClockIn">
      <div class="modal-content">
        <div class="modal-header">
          <h2>开工打卡</h2>
          <button class="close-btn" @click="cancelClockIn">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- 步骤指示器 -->
          <div class="step-indicator-row">
            <div class="step-indicator" 
              v-for="(step, index) in clockInSteps" 
              :key="index"
              :class="{'active': clockInCurrentStep >= index, 'completed': clockInCurrentStep > index}">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-label">{{ step.label }}</div>
            </div>
          </div>
          
          <!-- 步骤1: 上传照片 -->
          <div class="clock-in-step" v-if="clockInCurrentStep === 0">
            <h3>上传开工照片</h3>
            <p class="step-desc">请上传现场照片，照片将自动添加您的个人信息水印</p>
            
            <div class="photo-upload-area" v-if="!clockInPhoto">
              <div class="upload-placeholder" @click="triggerPhotoUpload">
                <i class="fas fa-camera"></i>
                <p>点击上传照片</p>
                <small>或将图片拖放到此处</small>
              </div>
              <input type="file" ref="photoInput" accept="image/*" style="display:none" @change="handlePhotoUpload">
            </div>
            
            <div class="photo-preview" v-else>
              <div class="photo-container">
                <img :src="clockInPhoto" alt="开工打卡照片">
                <div class="photo-watermark">
                  <div class="watermark-info">
                    <p>{{ userFullName }} | {{ currentTime }}</p>
                    <p>{{ currentDate }}</p>
                    <p>三星建筑有限公司</p>
                  </div>
                </div>
              </div>
              <div class="photo-actions">
                <button class="action-btn" @click="resetPhoto">
                  <i class="fas fa-redo"></i> 重新上传
                </button>
                <button class="action-btn primary" @click="goToNextStep">
                  <i class="fas fa-check"></i> 确认使用
                </button>
              </div>
            </div>
          </div>
          
          <!-- 步骤2: 确认工时 -->
          <div class="clock-in-step" v-if="clockInCurrentStep === 1">
            <h3>确认工作时长</h3>
            <p class="step-desc">开工打卡后，系统将开始计时，标准工作时长为10小时</p>
            
            <div class="timer-setting">
              <div class="countdown-display">
                <span class="time-value">10</span>
                <span class="time-label">小时</span>
                <span class="time-value">00</span>
                <span class="time-label">分钟</span>
              </div>
              
              <div class="fixed-work-hours">
                <div class="work-hours-info">
                  <i class="fas fa-business-time"></i>
                  <span>标准工作时长: <strong>10小时</strong></span>
                </div>
                <div class="work-hours-info">
                  <i class="fas fa-clock"></i>
                  <span>预计下班时间: <strong>{{ estimatedEndTime }}</strong></span>
                </div>
              </div>
              
              <p class="reminder">系统将在倒计时结束前30分钟提醒您</p>
            </div>
            
            <div class="step-actions">
              <button class="action-btn" @click="goToPrevStep">
                <i class="fas fa-arrow-left"></i> 上一步
              </button>
              <button class="action-btn primary" @click="goToNextStep">
                <i class="fas fa-arrow-right"></i> 下一步
              </button>
            </div>
          </div>
          
          <!-- 步骤3: 确认材料 -->
          <div class="clock-in-step" v-if="clockInCurrentStep === 2">
            <h3>确认项目材料</h3>
            <p class="step-desc">请核对并确认今日使用的项目材料数量</p>
            
            <div class="materials-list">
              <div class="material-item" v-for="(material, index) in projectMaterials" :key="index">
                <div class="material-info">
                  <div class="material-name">{{ material.name }}</div>
                  <div class="material-unit">{{ material.unit }}</div>
                </div>
                <div class="material-quantity">
                  <button class="quantity-btn" @click="decreaseMaterial(index)" :disabled="material.quantity <= 0">-</button>
                  <input type="number" v-model="material.quantity" min="0" max="9999">
                  <button class="quantity-btn" @click="increaseMaterial(index)">+</button>
                </div>
              </div>
              
              <div class="add-material">
                <input type="text" v-model="newMaterial.name" placeholder="添加其他材料...">
                <input type="text" v-model="newMaterial.unit" placeholder="单位" class="unit-input">
                <button class="action-btn small" @click="addNewMaterial" :disabled="!newMaterial.name || !newMaterial.unit">
                  <i class="fas fa-plus"></i> 添加
                </button>
              </div>
            </div>
            
            <div class="step-actions">
              <button class="action-btn" @click="goToPrevStep">
                <i class="fas fa-arrow-left"></i> 上一步
              </button>
              <button class="action-btn primary" @click="completeClockIn">
                <i class="fas fa-check-circle"></i> 完成打卡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 收工打卡流程弹窗 -->
    <div class="modal-overlay" v-if="showClockOutModal" @click.self="cancelClockOut">
      <div class="modal-content">
        <div class="modal-header">
          <h2>收工打卡</h2>
          <button class="close-btn" @click="cancelClockOut">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- 步骤指示器 -->
          <div class="step-indicator-row">
            <div class="step-indicator" 
              v-for="(step, index) in clockOutSteps" 
              :key="index"
              :class="{'active': clockOutCurrentStep >= index, 'completed': clockOutCurrentStep > index}">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-label">{{ step.label }}</div>
            </div>
          </div>
          
          <!-- 步骤1: 上传照片 -->
          <div class="clock-in-step" v-if="clockOutCurrentStep === 0">
            <h3>上传收工照片</h3>
            <p class="step-desc">请上传收工现场照片，照片将自动添加您的个人信息水印</p>
            
            <div class="photo-upload-area" v-if="!clockOutPhoto">
              <div class="upload-placeholder" @click="triggerClockOutPhotoUpload">
                <i class="fas fa-camera"></i>
                <p>点击上传照片</p>
                <small>或将图片拖放到此处</small>
              </div>
              <input type="file" ref="clockOutPhotoInput" accept="image/*" style="display:none" @change="handleClockOutPhotoUpload">
            </div>
            
            <div class="photo-preview" v-else>
              <div class="photo-container">
                <img :src="clockOutPhoto" alt="收工打卡照片">
                <div class="photo-watermark">
                  <div class="watermark-info">
                    <p>{{ userFullName }} | {{ currentTime }}</p>
                    <p>{{ currentDate }}</p>
                    <p>三星建筑有限公司</p>
                  </div>
                </div>
              </div>
              <div class="photo-actions">
                <button class="action-btn" @click="resetClockOutPhoto">
                  <i class="fas fa-redo"></i> 重新上传
                </button>
                <button class="action-btn primary" @click="goToNextClockOutStep">
                  <i class="fas fa-check"></i> 确认使用
                </button>
              </div>
            </div>
          </div>
          
          <!-- 步骤2: 确认材料使用 -->
          <div class="clock-in-step" v-if="clockOutCurrentStep === 1">
            <h3>确认今日使用材料</h3>
            <p class="step-desc">请确认今日使用的材料数量，以便安排明日采购</p>
            
            <div class="materials-list">
              <div class="material-item" v-for="(material, index) in usedMaterials" :key="index">
                <div class="material-info">
                  <div class="material-name">{{ material.name }}</div>
                  <div class="material-unit">{{ material.unit }}</div>
                </div>
                <div class="material-quantity">
                  <button class="quantity-btn" @click="decreaseUsedMaterial(index)" :disabled="material.quantity <= 0">-</button>
                  <input type="number" v-model="material.quantity" min="0" max="9999">
                  <button class="quantity-btn" @click="increaseUsedMaterial(index)">+</button>
                </div>
              </div>
              
              <div class="add-material">
                <input type="text" v-model="newUsedMaterial.name" placeholder="添加其他材料...">
                <input type="text" v-model="newUsedMaterial.unit" placeholder="单位" class="unit-input">
                <button class="action-btn small" @click="addNewUsedMaterial" :disabled="!newUsedMaterial.name || !newUsedMaterial.unit">
                  <i class="fas fa-plus"></i> 添加
                </button>
              </div>
            </div>
            
            <div class="step-actions">
              <button class="action-btn" @click="goToPrevClockOutStep">
                <i class="fas fa-arrow-left"></i> 上一步
              </button>
              <button class="action-btn primary" @click="goToNextClockOutStep">
                <i class="fas fa-arrow-right"></i> 下一步
              </button>
            </div>
          </div>
          
          <!-- 步骤3: 收工结束 -->
          <div class="clock-in-step" v-if="clockOutCurrentStep === 2">
            <h3>收工结束确认</h3>
            <p class="step-desc">您的工作时间已记录，请确认信息无误后完成打卡</p>
            
            <div class="timer-setting">
              <div class="work-summary">
                <div class="work-hours-info">
                  <i class="fas fa-business-time"></i>
                  <span>今日工作时长: <strong>{{ workingHours }}</strong></span>
                </div>
                <div class="work-hours-info">
                  <i class="fas fa-clock"></i>
                  <span>开工时间: <strong>{{ clockInTimeDisplay }}</strong></span>
                </div>
                <div class="work-hours-info">
                  <i class="fas fa-clock"></i>
                  <span>收工时间: <strong>{{ currentTime }}</strong></span>
                </div>
              </div>
              
              <p class="reminder">工作记录将自动提交至系统统计</p>
            </div>
            
            <div class="step-actions">
              <button class="action-btn" @click="goToPrevClockOutStep">
                <i class="fas fa-arrow-left"></i> 上一步
              </button>
              <button class="action-btn primary" @click="completeClockOut">
                <i class="fas fa-check-circle"></i> 完成打卡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能卡片导航 -->
    <div class="function-cards">
      <router-link to="/internal/workspace" class="function-card workspace active">
        <div class="function-icon">
          <i class="fas fa-desktop"></i>
        </div>
        <span class="function-name">工作台</span>
      </router-link>
      
      <router-link to="/internal/salary" class="function-card salary">
        <div class="function-icon">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <span class="function-name">工 资</span>
      </router-link>
      
      <router-link to="/internal/attendance" class="function-card attendance">
        <div class="function-icon">
          <i class="fas fa-user-clock"></i>
        </div>
        <span class="function-name">考 勤</span>
      </router-link>
      
      <router-link to="/internal/leave" class="function-card leave">
        <div class="function-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <span class="function-name">请 假</span>
      </router-link>
    </div>

    <!-- 今日工作安排 -->
    <div class="work-schedule">
      <div class="section-header">
        <h2>今日工作安排</h2>
        <span class="date-badge">{{ currentDate }}</span>
      </div>

      <div class="task-list">
        <div v-if="!todayTasks.length" class="no-tasks">
          <i class="fas fa-clipboard-check"></i>
          <p>今天暂无安排任务</p>
        </div>

        <div v-for="(task, index) in todayTasks" :key="index" class="task-item">
          <div class="task-header">
            <div class="task-title">{{ task.title }}</div>
            <div class="task-status" :class="task.status">{{ getStatusText(task.status) }}</div>
          </div>
          
          <div class="task-details">
            <div class="task-time">
              <i class="fas fa-clock"></i>
              <span>{{ task.startTime }} - {{ task.endTime }}</span>
            </div>
            <div class="task-location" v-if="task.location">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ task.location }}</span>
            </div>
            <div class="task-description">{{ task.description }}</div>
          </div>

          <div class="task-actions" v-if="task.status === 'pending'">
            <button class="action-btn start-task" @click="startTask(index)">
              开始任务
            </button>
          </div>

          <div class="task-actions" v-if="task.status === 'in-progress'">
            <button class="action-btn upload-photo" @click="uploadPhoto(index)">
              <i class="fas fa-camera"></i> 上传照片
            </button>
            <button class="action-btn complete-task" @click="completeTask(index)">
              <i class="fas fa-check"></i> 完成任务
            </button>
          </div>

          <div class="task-step-progress" v-if="task.steps && task.steps.length">
            <div class="step-header">
              <h3>执行步骤</h3>
              <span class="step-progress">{{ getCompletedStepsCount(task) }}/{{ task.steps.length }}</span>
            </div>
            
            <div class="step-list">
              <div v-for="(step, stepIndex) in task.steps" :key="stepIndex" class="step-item" 
                :class="{'completed': step.completed}">
                <div class="step-indicator">
                  <div class="step-number">{{ stepIndex + 1 }}</div>
                  <div class="step-line" v-if="stepIndex < task.steps.length - 1"></div>
                </div>
                <div class="step-content">
                  <div class="step-name">{{ step.name }}</div>
                  <div class="step-description">{{ step.description }}</div>
                  <div class="step-actions" v-if="!step.completed && task.status === 'in-progress'">
                    <button class="step-btn" @click="completeStep(index, stepIndex)">
                      <i class="fas fa-check-circle"></i> 标记完成
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 项目材料盘点 -->
    <div class="material-inventory">
      <div class="section-header">
        <h2>项目材料盘点</h2>
        <button class="action-btn small" @click="addMaterialInventory">
          <i class="fas fa-plus"></i> 添加记录
        </button>
      </div>
      
      <div class="inventory-list">
        <div class="inventory-item" v-for="(inventory, index) in materialInventories" :key="index">
          <div class="inventory-row">
            <div class="inventory-label">项目名称：</div>
            <div class="inventory-value">{{ inventory.projectName }}</div>
          </div>
          <div class="inventory-row">
            <div class="inventory-label">项目材料品种：</div>
            <div class="inventory-value">{{ inventory.materialType }}</div>
          </div>
          <div class="inventory-row">
            <div class="inventory-label">数量：</div>
            <div class="inventory-value">{{ inventory.quantity }}</div>
          </div>
          <div class="inventory-row">
            <div class="inventory-label">剩余：</div>
            <div class="inventory-value">{{ inventory.remaining }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 设备借用 -->
    <div class="equipment-rental">
      <div class="section-header">
        <h2>设备借用</h2>
        <button class="action-btn small" @click="addEquipmentRental">
          <i class="fas fa-plus"></i> 添加借用
        </button>
      </div>
      
      <div class="rental-list">
        <div class="rental-item" v-for="(rental, index) in equipmentRentals" :key="index">
          <div class="rental-row">
            <div class="rental-label">设备名称：</div>
            <div class="rental-value">{{ rental.name }}</div>
          </div>
          <div class="rental-row">
            <div class="rental-label">设备情况：</div>
            <div class="rental-value">{{ rental.condition }}</div>
          </div>
          <div class="rental-row">
            <div class="rental-label">设备数量：</div>
            <div class="rental-value">{{ rental.quantity }}</div>
          </div>
          <div class="rental-row">
            <div class="rental-label">设备跟踪：</div>
            <div class="rental-value">{{ rental.tracking }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="workspace-footer">
      <div class="status-info">
        <div class="status-item" :class="{'active': isClockedIn}">
          <i class="fas fa-circle"></i>
          <span>{{ isClockedIn ? '工作中' : '未上班' }}</span>
        </div>
        <div class="status-item">
          <i class="fas fa-business-time"></i>
          <span>今日已工作: {{ workingHours }}</span>
        </div>
        <div class="status-item countdown" v-if="isClockedIn && showCountdown">
          <i class="fas fa-hourglass-half"></i>
          <span>剩余: {{ countdownDisplay }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useUserStore } from '../store/userStore'

export default {
  name: 'InternalWorkspace',
  
  setup() {
    const userStore = useUserStore()
    
    // 时间相关
    const now = new Date()
    const currentTime = ref(new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }))
    const currentDate = ref(now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }))
    const lunarDate = ref('农历三月初三') // 模拟数据，实际项目中可以使用农历日期转换库
    
    // 更新时间的计时器
    const timeInterval = setInterval(() => {
      currentTime.value = new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }, 60000) // 每分钟更新一次
    
    // 用户信息
    const userFullName = computed(() => userStore.userFullName)
    const userAvatarUrl = ref(null) // 默认为空，实际项目中可从用户数据获取
    
    // 打卡状态
    const isClockedIn = ref(false)
    const clockInTime = ref(null)
    const clockOutTime = ref(null)
    const workingHours = ref('00:00')
    const workingTimer = ref(null)
    const isWorkTime = computed(() => {
      // 始终返回true，便于测试
      return true
      // 实际逻辑，工作时间在7:00-19:00之间
      // const hour = new Date().getHours()
      // return hour >= 7 && hour < 19
    })
    
    // 开工打卡流程相关
    const showClockInModal = ref(false)
    const clockInSteps = [
      { label: '上传照片' },
      { label: '确认工时' },
      { label: '确认材料' }
    ]
    const clockInCurrentStep = ref(0)
    const photoInput = ref(null)
    const clockInPhoto = ref(null)
    
    // 收工打卡流程相关
    const showClockOutModal = ref(false)
    const clockOutSteps = [
      { label: '上传照片' },
      { label: '确认材料' },
      { label: '结束确认' }
    ]
    const clockOutCurrentStep = ref(0)
    const clockOutPhotoInput = ref(null)
    const clockOutPhoto = ref(null)
    const clockInTimeDisplay = computed(() => {
      if (!clockInTime.value) return '--:--'
      return clockInTime.value.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    })
    
    // 使用材料记录
    const usedMaterials = ref([
      { name: '水泥', unit: '袋', quantity: 10 },
      { name: '钢筋', unit: '吨', quantity: 0.5 },
      { name: '砂石', unit: '方', quantity: 1 },
      { name: '模板', unit: '张', quantity: 15 }
    ])
    const newUsedMaterial = ref({ name: '', unit: '', quantity: 1 })
    
    // 工时设置
    const workHoursSetting = ref(10) // 固定10小时，不再可调整
    const countdownHours = ref(10)
    const countdownMinutes = ref(0)
    const countdownTimer = ref(null)
    const countdownDisplay = ref('10:00:00')
    const showCountdown = ref(false)
    
    // 计算预计下班时间
    const estimatedEndTime = computed(() => {
      const now = new Date()
      const endTime = new Date(now.getTime() + 10 * 60 * 60 * 1000) // 10小时后
      return endTime.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    })
    
    // 项目材料
    const projectMaterials = ref([
      { name: '水泥', unit: '袋', quantity: 25 },
      { name: '钢筋', unit: '吨', quantity: 1.5 },
      { name: '砂石', unit: '方', quantity: 3 },
      { name: '模板', unit: '张', quantity: 40 }
    ])
    const newMaterial = ref({ name: '', unit: '', quantity: 1 })
    
    // 打卡流程控制
    const showClockInProcess = () => {
      console.log('开工打卡流程开始', new Date().toLocaleTimeString())
      // 重置打卡流程
      showClockInModal.value = true
      clockInCurrentStep.value = 0
      clockInPhoto.value = null
      workHoursSetting.value = 10
      
      // 重置新增材料表单
      newMaterial.value = { name: '', unit: '', quantity: 1 }
    }
    
    const cancelClockIn = () => {
      if (confirm('确定要取消打卡流程吗？已填写的信息将不会保存。')) {
        showClockInModal.value = false
      }
    }
    
    const goToNextStep = () => {
      if (clockInCurrentStep.value < clockInSteps.length - 1) {
        clockInCurrentStep.value++
      }
    }
    
    const goToPrevStep = () => {
      if (clockInCurrentStep.value > 0) {
        clockInCurrentStep.value--
      }
    }
    
    // 照片上传
    const triggerPhotoUpload = () => {
      photoInput.value.click()
    }
    
    const handlePhotoUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // 实际项目中，这里可以调用API来处理照片并添加水印
          // 这里为了演示，直接显示照片并在前端添加水印样式
          clockInPhoto.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
    
    const resetPhoto = () => {
      clockInPhoto.value = null
      if (photoInput.value) {
        photoInput.value.value = ''
      }
    }
    
    // 材料相关
    const increaseMaterial = (index) => {
      projectMaterials.value[index].quantity++
    }
    
    const decreaseMaterial = (index) => {
      if (projectMaterials.value[index].quantity > 0) {
        projectMaterials.value[index].quantity--
      }
    }
    
    const addNewMaterial = () => {
      if (newMaterial.value.name && newMaterial.value.unit) {
        projectMaterials.value.push({
          name: newMaterial.value.name,
          unit: newMaterial.value.unit,
          quantity: parseInt(newMaterial.value.quantity) || 1
        })
        newMaterial.value = { name: '', unit: '', quantity: 1 }
      }
    }
    
    // 完成打卡
    const completeClockIn = () => {
      isClockedIn.value = true
      clockInTime.value = new Date()
      showClockInModal.value = false
      
      // 实际项目中应调用API保存打卡记录，包括照片和材料信息
      console.log('打卡成功:', {
        time: clockInTime.value,
        photo: '已上传',
        workHours: workHoursSetting.value,
        materials: projectMaterials.value
      })
      
      // 开始计时
      startWorkingTimer()
      
      // 立即更新一次工作时间显示
      workingHours.value = '00:00'
      
      // 启动倒计时
      showCountdown.value = true
      updateCountdown() // 立即更新一次
      countdownTimer.value = setInterval(updateCountdown, 1000) // 每秒更新一次
    }
    
    // 停止计时
    const stopWorkingTimer = () => {
      if (workingTimer.value) {
        clearInterval(workingTimer.value)
        workingTimer.value = null
      }
      
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
        countdownTimer.value = null
        showCountdown.value = false
      }
    }
    
    // 打卡操作
    const handleClockOut = () => {
      // 此方法保留作为直接收工打卡的后备方法
      isClockedIn.value = false
      clockOutTime.value = new Date()
      // 实际项目中应调用API保存打卡记录
      console.log('下班打卡成功:', clockOutTime.value)
      // 停止计时
      stopWorkingTimer()
    }
    
    // 收工打卡流程
    const showClockOutProcess = () => {
      console.log('收工打卡流程开始', new Date().toLocaleTimeString())
      // 重置打卡流程
      showClockOutModal.value = true
      clockOutCurrentStep.value = 0
      clockOutPhoto.value = null
      
      // 预填充今日使用的材料
      usedMaterials.value = [
        { name: '水泥', unit: '袋', quantity: 10 },
        { name: '钢筋', unit: '吨', quantity: 0.5 },
        { name: '砂石', unit: '方', quantity: 1 },
        { name: '模板', unit: '张', quantity: 15 }
      ]
      
      // 重置新增材料表单
      newUsedMaterial.value = { name: '', unit: '', quantity: 1 }
    }
    
    const cancelClockOut = () => {
      if (confirm('确定要取消收工打卡流程吗？已填写的信息将不会保存。')) {
        showClockOutModal.value = false
      }
    }
    
    const goToNextClockOutStep = () => {
      if (clockOutCurrentStep.value < clockOutSteps.length - 1) {
        clockOutCurrentStep.value++
      }
    }
    
    const goToPrevClockOutStep = () => {
      if (clockOutCurrentStep.value > 0) {
        clockOutCurrentStep.value--
      }
    }
    
    // 收工照片上传
    const triggerClockOutPhotoUpload = () => {
      if (clockOutPhotoInput.value) {
        clockOutPhotoInput.value.click()
      }
    }
    
    const handleClockOutPhotoUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // 实际项目中，这里可以调用API来处理照片并添加水印
          // 这里为了演示，直接显示照片并在前端添加水印样式
          clockOutPhoto.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
    
    const resetClockOutPhoto = () => {
      clockOutPhoto.value = null
      if (clockOutPhotoInput.value) {
        clockOutPhotoInput.value.value = ''
      }
    }
    
    // 收工材料处理
    const increaseUsedMaterial = (index) => {
      usedMaterials.value[index].quantity++
    }
    
    const decreaseUsedMaterial = (index) => {
      if (usedMaterials.value[index].quantity > 0) {
        usedMaterials.value[index].quantity--
      }
    }
    
    const addNewUsedMaterial = () => {
      if (newUsedMaterial.value.name && newUsedMaterial.value.unit) {
        usedMaterials.value.push({
          name: newUsedMaterial.value.name,
          unit: newUsedMaterial.value.unit,
          quantity: parseInt(newUsedMaterial.value.quantity) || 1
        })
        newUsedMaterial.value = { name: '', unit: '', quantity: 1 }
      }
    }
    
    // 完成收工打卡
    const completeClockOut = () => {
      isClockedIn.value = false
      clockOutTime.value = new Date()
      showClockOutModal.value = false
      
      // 实际项目中应调用API保存打卡记录，包括照片和材料使用信息
      console.log('收工打卡成功:', {
        time: clockOutTime.value,
        photo: '已上传',
        workingHours: workingHours.value,
        usedMaterials: usedMaterials.value
      })
      
      // 停止计时
      stopWorkingTimer()
      
      // 显示成功提示
      alert('收工打卡成功！')
    }
    
    // 今日任务
    const todayTasks = ref([
      {
        title: '西江花园项目基础施工',
        status: 'pending',
        startTime: '09:00',
        endTime: '12:00',
        location: '西江花园工地',
        description: '负责西江花园B区3号楼基础施工监督，确保施工进度和质量。',
        steps: [
          {
            name: '现场安全检查',
            description: '检查工人安全帽、安全带等防护措施是否到位',
            completed: false
          },
          {
            name: '材料验收',
            description: '验收今日使用的水泥、钢筋等建材',
            completed: false
          },
          {
            name: '施工监督',
            description: '监督施工团队按图纸施工，记录施工进度',
            completed: false
          },
          {
            name: '质量检测',
            description: '对完成的部分进行质量抽检，记录问题',
            completed: false
          }
        ]
      },
      {
        title: '项目周报填写',
        status: 'pending',
        startTime: '14:00',
        endTime: '15:30',
        description: '填写本周项目进度报告，包括进度、问题及下周计划。',
        steps: [
          {
            name: '收集信息',
            description: '整理本周项目进度数据和遇到的问题',
            completed: false
          },
          {
            name: '填写周报',
            description: '在系统中填写标准周报表格',
            completed: false
          },
          {
            name: '提交审核',
            description: '提交给项目经理审核',
            completed: false
          }
        ]
      }
    ])
    
    // 项目材料盘点
    const materialInventories = ref([
      {
        projectName: '西江花园项目',
        materialType: '水泥',
        quantity: '100袋',
        remaining: '25袋'
      },
      {
        projectName: '翰林苑项目',
        materialType: '钢筋',
        quantity: '5吨',
        remaining: '1.2吨'
      }
    ])
    
    const addMaterialInventory = () => {
      // 实际项目中应打开表单弹窗，这里仅为示例
      alert('添加材料盘点功能将在实际项目中实现')
    }
    
    // 设备借用
    const equipmentRentals = ref([
      {
        name: '电动钻孔机',
        condition: '良好',
        quantity: 2,
        tracking: '工地A区'
      },
      {
        name: '混凝土搅拌机',
        condition: '轻微磨损',
        quantity: 1,
        tracking: '工地B区'
      }
    ])
    
    const addEquipmentRental = () => {
      // 实际项目中应打开表单弹窗，这里仅为示例
      alert('添加设备借用功能将在实际项目中实现')
    }
    
    // 开始计时
    const startWorkingTimer = () => {
      if (workingTimer.value) return
      
      workingTimer.value = setInterval(() => {
        if (!clockInTime.value) return
        
        const now = new Date()
        const diff = Math.floor((now - clockInTime.value) / 1000) // 秒数差
        const hours = Math.floor(diff / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        workingHours.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      }, 60000) // 每分钟更新一次
    }
    
    // 任务操作
    const startTask = (index) => {
      todayTasks.value[index].status = 'in-progress'
    }
    
    const completeTask = (index) => {
      todayTasks.value[index].status = 'completed'
    }
    
    const uploadPhoto = (index) => {
      // 模拟上传照片功能
      console.log('上传照片，任务索引:', index)
      // 实际项目中应调用文件上传组件
      alert('照片上传功能将在实际项目中实现')
    }
    
    const completeStep = (taskIndex, stepIndex) => {
      todayTasks.value[taskIndex].steps[stepIndex].completed = true
    }
    
    // 获取已完成步骤数
    const getCompletedStepsCount = (task) => {
      return task.steps.filter(step => step.completed).length
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待开始',
        'in-progress': '进行中',
        'completed': '已完成'
      }
      return statusMap[status] || status
    }
    
    // 倒计时
    const updateCountdown = () => {
      if (!clockInTime.value) return
      
      const now = new Date()
      const targetTime = new Date(clockInTime.value.getTime() + workHoursSetting.value * 60 * 60 * 1000)
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000)) // 剩余秒数
      
      if (diff <= 0) {
        // 倒计时结束
        clearInterval(countdownTimer.value)
        countdownDisplay.value = '00:00:00'
        
        // 提醒用户打卡结束
        alert('工作时间已结束，请及时收工打卡！')
        showCountdown.value = false
        return
      }
      
      // 更新倒计时显示
      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60
      
      countdownDisplay.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      
      // 提前30分钟提醒
      if (diff <= 30 * 60 && diff > 30 * 60 - 10) {
        alert('您的工作时间还剩30分钟，请注意合理安排工作！')
      }
    }
    
    // 测试按钮
    const testClockIn = () => {
      console.log('测试开工打卡功能')
      showClockInProcess()
    }
    
    onMounted(() => {
      console.log('工作台已加载')
      // 这里可以添加加载用户数据、打卡状态等逻辑
      
      // 确保DOM元素完全渲染后再查找引用
      nextTick(() => {
        console.log('检查photoInput引用', photoInput.value)
      })
    })
    
    onUnmounted(() => {
      // 清除定时器
      clearInterval(timeInterval)
      if (workingTimer.value) {
        clearInterval(workingTimer.value)
      }
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
      }
    })
    
    return {
      currentTime,
      currentDate,
      lunarDate,
      userFullName,
      userAvatarUrl,
      isClockedIn,
      isWorkTime,
      workingHours,
      todayTasks,
      showClockInProcess,
      handleClockOut,
      startTask,
      completeTask,
      uploadPhoto,
      completeStep,
      getCompletedStepsCount,
      getStatusText,
      // 新增的打卡流程相关属性和方法
      showClockInModal,
      clockInSteps,
      clockInCurrentStep,
      photoInput,
      clockInPhoto,
      workHoursSetting,
      countdownHours,
      countdownMinutes,
      countdownDisplay,
      showCountdown,
      projectMaterials,
      newMaterial,
      cancelClockIn,
      goToNextStep,
      goToPrevStep,
      triggerPhotoUpload,
      handlePhotoUpload,
      resetPhoto,
      increaseMaterial,
      decreaseMaterial,
      addNewMaterial,
      completeClockIn,
      estimatedEndTime,
      testClockIn,
      materialInventories,
      addMaterialInventory,
      equipmentRentals,
      addEquipmentRental,
      showClockOutModal,
      clockOutSteps,
      clockOutCurrentStep,
      clockOutPhotoInput,
      clockOutPhoto,
      clockInTimeDisplay,
      usedMaterials,
      newUsedMaterial,
      // 新增收工打卡相关方法
      showClockOutProcess,
      cancelClockOut,
      goToNextClockOutStep,
      goToPrevClockOutStep,
      triggerClockOutPhotoUpload,
      handleClockOutPhotoUpload,
      resetClockOutPhoto,
      increaseUsedMaterial,
      decreaseUsedMaterial,
      addNewUsedMaterial,
      completeClockOut
    }
  }
}
</script>

<style scoped>
.internal-workspace {
  padding: 1rem;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
  max-width: 100%;
  overflow-x: hidden;
}

/* 顶部信息区 */
.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.time-info {
  display: flex;
  flex-direction: column;
}

.current-time {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.date-info {
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
}

.current-date {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.lunar-date {
  font-size: 0.8rem;
  color: #95a5a6;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-welcome {
  font-size: 1rem;
  color: #2c3e50;
  margin-right: 0.75rem;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #3498db;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 打卡按钮区 */
.clock-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  position: relative;
  z-index: 10;
}

.clock-btn {
  flex: 1;
  padding: 1rem;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  height: 90px;
  position: relative;
  z-index: 5;
}

.clock-in {
  background-color: #2ecc71;
  color: white;
}

.clock-out {
  background-color: #e74c3c;
  color: white;
}

.clock-btn i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.clock-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 功能卡片样式 */
.function-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.function-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 12px;
  text-decoration: none;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.function-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.function-card.active {
  border: 2px solid #3498db;
}

.function-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
}

.function-name {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 功能卡片颜色 */
.function-card.workspace {
  background-color: #74b9ff;
  color: #fff;
}

.function-card.salary {
  background-color: #55efc4;
  color: #2d3436;
}

.function-card.attendance {
  background-color: #ffeaa7;
  color: #2d3436;
}

.function-card.leave {
  background-color: #ff7675;
  color: #fff;
}

/* 工作安排部分 */
.work-schedule {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ecf0f1;
}

.section-header h2 {
  font-size: 1.25rem;
  margin: 0;
  color: #2c3e50;
}

.date-badge {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background-color: #f1f2f6;
  color: #7f8c8d;
  border-radius: 4px;
}

.no-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #95a5a6;
}

.no-tasks i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #3498db;
}

.task-item[data-status="completed"] {
  border-left-color: #2ecc71;
}

.task-item[data-status="in-progress"] {
  border-left-color: #f39c12;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.task-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.task-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.task-status.pending {
  background-color: #e3f7ff;
  color: #3498db;
}

.task-status.in-progress {
  background-color: #fef5e7;
  color: #f39c12;
}

.task-status.completed {
  background-color: #e3f7ef;
  color: #2ecc71;
}

.task-details {
  margin-bottom: 1rem;
}

.task-time, .task-location {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.task-time i, .task-location i {
  margin-right: 0.5rem;
  width: 16px;
  text-align: center;
}

.task-description {
  font-size: 0.9rem;
  color: #2c3e50;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.task-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn i {
  margin-right: 0.5rem;
}

.start-task {
  background-color: #3498db;
  color: white;
}

.upload-photo {
  background-color: #9b59b6;
  color: white;
}

.complete-task {
  background-color: #2ecc71;
  color: white;
}

.task-step-progress {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #ecf0f1;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.step-header h3 {
  font-size: 1rem;
  margin: 0;
  color: #2c3e50;
}

.step-progress {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-item {
  display: flex;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #e9eef6;
  color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 0.75rem;
}

.step-item.completed .step-number {
  background-color: #3498db;
  color: white;
}

.step-line {
  width: 2px;
  height: 100%;
  background-color: #ecf0f1;
  margin: 5px 0;
  margin-right: 0.75rem;
}

.step-content {
  flex: 1;
}

.step-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.step-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.step-btn {
  background-color: transparent;
  border: 1px solid #3498db;
  color: #3498db;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.step-btn:hover {
  background-color: #3498db;
  color: white;
}

/* 底部状态栏 */
.workspace-footer {
  position: sticky;
  bottom: 0;
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.status-info {
  display: flex;
  justify-content: space-around;
}

.status-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.status-item i {
  margin-right: 0.5rem;
}

.status-item.active {
  color: #2ecc71;
}

.status-item.countdown {
  color: #e67e22;
  font-weight: 500;
}

/* 打卡流程弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #7f8c8d;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

/* 步骤指示器 */
.step-indicator-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.step-indicator-row::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 30px;
  right: 30px;
  height: 2px;
  background-color: #e9ecef;
  z-index: 1;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  transition: all 0.3s;
}

.step-label {
  font-size: 0.8rem;
  color: #7f8c8d;
  text-align: center;
  transition: all 0.3s;
}

.step-indicator.active .step-number {
  background-color: #3498db;
  color: white;
}

.step-indicator.active .step-label {
  color: #3498db;
  font-weight: 600;
}

.step-indicator.completed .step-number {
  background-color: #2ecc71;
  color: white;
}

/* 步骤内容 */
.clock-in-step {
  animation: fadeIn 0.3s;
}

.clock-in-step h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.step-desc {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

/* 照片上传 */
.photo-upload-area {
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.photo-upload-area:hover {
  border-color: #3498db;
  background-color: #f1f9ff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-placeholder i {
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.upload-placeholder p {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #2c3e50;
}

.upload-placeholder small {
  color: #95a5a6;
}

.photo-preview {
  margin-bottom: 1.5rem;
}

.photo-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.photo-container img {
  width: 100%;
  display: block;
}

.photo-watermark {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  line-height: 1.5;
}

.photo-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* 确认工时 */
.timer-setting {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.countdown-display {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin-bottom: 1.5rem;
}

.time-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  padding: 0 0.5rem;
}

.time-label {
  font-size: 1rem;
  color: #7f8c8d;
  margin-right: 1rem;
}

.fixed-work-hours {
  background-color: #e9f7fe;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.work-hours-info {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.work-hours-info i {
  margin-right: 0.75rem;
  color: #3498db;
  width: 20px;
  text-align: center;
}

.work-hours-info strong {
  color: #3498db;
}

.reminder {
  text-align: center;
  color: #e67e22;
  font-size: 0.9rem;
  margin: 0;
}

/* 确认材料 */
.materials-list {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.material-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
}

.material-item:last-child {
  border-bottom: none;
}

.material-info {
  flex: 1;
}

.material-name {
  font-weight: 600;
  color: #2c3e50;
}

.material-unit {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.material-quantity {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #bdc3c7;
  background-color: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
}

.material-quantity input {
  width: 60px;
  height: 30px;
  text-align: center;
  margin: 0 0.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

.add-material {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.add-material input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

.unit-input {
  width: 80px !important;
  flex: 0 0 auto !important;
}

/* 操作按钮 */
.step-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background-color: #ecf0f1;
  color: #2c3e50;
}

.action-btn i {
  margin-right: 0.5rem;
}

.action-btn.primary {
  background-color: #3498db;
  color: white;
}

.action-btn.small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .function-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .workspace-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .user-info {
    margin-top: 1rem;
    width: 100%;
    justify-content: space-between;
  }
  
  .function-cards {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .function-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .function-name {
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  .internal-workspace {
    padding: 0.75rem;
  }
  
  .workspace-header {
    padding: 0.75rem;
  }
  
  .current-time {
    font-size: 1.75rem;
  }
  
  .function-cards {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }
  
  .function-card {
    padding: 0.75rem 0.5rem;
  }
  
  .function-icon {
    width: 35px;
    height: 35px;
    font-size: 1.1rem;
    margin-bottom: 0.35rem;
  }
  
  .function-name {
    font-size: 0.8rem;
  }
  
  .task-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 100%;
  }
}

/* 项目材料盘点和设备借用共享样式 */
.material-inventory,
.equipment-rental {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.inventory-list,
.rental-list {
  margin-top: 1rem;
}

.inventory-item,
.rental-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.inventory-row,
.rental-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.inventory-row:last-child,
.rental-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.inventory-label,
.rental-label {
  font-weight: 500;
  color: #2c3e50;
}

.inventory-value,
.rental-value {
  color: #3498db;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .inventory-row,
  .rental-row {
    flex-direction: column;
    padding-bottom: 0.75rem;
  }
  
  .inventory-value,
  .rental-value {
    margin-top: 0.25rem;
  }
}
</style> 