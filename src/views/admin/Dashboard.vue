<!-- 
  Dashboard.vue
  Main admin dashboard for the construction company management system
-->
<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p class="dashboard-date">{{ currentDate }}</p>
    </div>
    
    <!-- Quick stats -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-card-icon">🏗️</div>
        <div class="stat-card-content">
          <h3>{{ projectsCount }}</h3>
          <p>Total Projects</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-icon">⚡</div>
        <div class="stat-card-content">
          <h3>{{ ongoingProjectsCount }}</h3>
          <p>Active Projects</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-icon">✅</div>
        <div class="stat-card-content">
          <h3>{{ completedProjectsCount }}</h3>
          <p>Completed Projects</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-icon">⏳</div>
        <div class="stat-card-content">
          <h3>{{ plannedProjectsCount }}</h3>
          <p>Planned Projects</p>
        </div>
      </div>
    </div>
    
    <!-- Project overview chart -->
    <div class="card chart-card">
      <div class="card-header">
        <h2>Projects Overview</h2>
        <div class="card-controls">
          <select v-model="chartTimeframe">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      <div class="chart-placeholder">
        <!-- In a real app, this would have a chart component -->
        <div class="chart-mock">
          <div class="chart-bar" style="height: 60%;">
            <span class="chart-value">60%</span>
          </div>
          <div class="chart-bar" style="height: 80%;">
            <span class="chart-value">80%</span>
          </div>
          <div class="chart-bar" style="height: 40%;">
            <span class="chart-value">40%</span>
          </div>
          <div class="chart-bar" style="height: 75%;">
            <span class="chart-value">75%</span>
          </div>
          <div class="chart-bar" style="height: 90%;">
            <span class="chart-value">90%</span>
          </div>
          <div class="chart-bar" style="height: 50%;">
            <span class="chart-value">50%</span>
          </div>
          <div class="chart-bar" style="height: 65%;">
            <span class="chart-value">65%</span>
          </div>
        </div>
        <div class="chart-legend">
          <span>Project Progress</span>
        </div>
      </div>
    </div>
    
    <!-- Projects table -->
    <div class="card">
      <div class="card-header">
        <h2>Recent Projects</h2>
        <div class="card-controls">
          <router-link to="/admin/projects" class="view-all-link">View All</router-link>
        </div>
      </div>
      <div class="table-container">
        <table class="projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Client</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Timeline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id">
              <td>{{ project.title }}</td>
              <td>{{ project.client }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(project.status)">
                  {{ getStatusText(project.status) }}
                </span>
              </td>
              <td>${{ formatNumber(project.budget) }}</td>
              <td>{{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}</td>
              <td>
                <button class="action-button">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Bottom cards -->
    <div class="bottom-cards">
      <!-- Recent activities -->
      <div class="card">
        <div class="card-header">
          <h2>Recent Activities</h2>
        </div>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">📝</div>
            <div class="activity-content">
              <p class="activity-text">New project proposal submitted for <strong>City Park Renovation</strong></p>
              <p class="activity-time">2 hours ago</p>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">✅</div>
            <div class="activity-content">
              <p class="activity-text"><strong>Modern Office Building</strong> milestone completed</p>
              <p class="activity-time">Yesterday</p>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">🔄</div>
            <div class="activity-content">
              <p class="activity-text">Updated timeline for <strong>Luxury Apartment Complex</strong></p>
              <p class="activity-time">2 days ago</p>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">💰</div>
            <div class="activity-content">
              <p class="activity-text">Budget approved for <strong>Shopping Mall Expansion</strong></p>
              <p class="activity-time">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Upcoming deadlines -->
      <div class="card">
        <div class="card-header">
          <h2>Upcoming Deadlines</h2>
        </div>
        <div class="deadline-list">
          <div class="deadline-item">
            <div class="deadline-date">
              <span class="deadline-day">15</span>
              <span class="deadline-month">May</span>
            </div>
            <div class="deadline-content">
              <h4>Foundation Completion</h4>
              <p>Modern Office Building</p>
            </div>
          </div>
          
          <div class="deadline-item">
            <div class="deadline-date">
              <span class="deadline-day">22</span>
              <span class="deadline-month">May</span>
            </div>
            <div class="deadline-content">
              <h4>Interior Design Approval</h4>
              <p>Luxury Apartment Complex</p>
            </div>
          </div>
          
          <div class="deadline-item">
            <div class="deadline-date">
              <span class="deadline-day">30</span>
              <span class="deadline-month">May</span>
            </div>
            <div class="deadline-content">
              <h4>Permit Submission</h4>
              <p>Shopping Mall Expansion</p>
            </div>
          </div>
          
          <div class="deadline-item">
            <div class="deadline-date">
              <span class="deadline-day">10</span>
              <span class="deadline-month">Jun</span>
            </div>
            <div class="deadline-content">
              <h4>Electrical Inspection</h4>
              <p>Modern Office Building</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '../../store/projectStore'

// Store
const projectStore = useProjectStore()

// Data
const projects = ref([])
const chartTimeframe = ref('month')
const currentDate = ref(new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}))

// Computed properties
const projectsCount = computed(() => projects.value.length)
const ongoingProjectsCount = computed(() => projects.value.filter(p => p.status === 'in-progress').length)
const completedProjectsCount = computed(() => projects.value.filter(p => p.status === 'completed').length)
const plannedProjectsCount = computed(() => projects.value.filter(p => p.status === 'planned').length)

// Methods
const formatNumber = (num) => {
  return num.toLocaleString('en-US')
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const getStatusClass = (status) => {
  const statusMap = {
    'in-progress': 'status-active',
    'completed': 'status-completed',
    'planned': 'status-planned'
  }
  return statusMap[status] || ''
}

const getStatusText = (status) => {
  const statusMap = {
    'in-progress': 'Active',
    'completed': 'Completed',
    'planned': 'Planned'
  }
  return statusMap[status] || status
}

// Lifecycle hooks
onMounted(async () => {
  await projectStore.fetchProjects()
  projects.value = projectStore.projects
})
</script>

<style scoped>
.dashboard {
  padding: 1rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin-bottom: 0.5rem;
}

.dashboard-date {
  color: #666;
  font-size: 0.9rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.stat-card-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.stat-card-content h3 {
  font-size: 1.8rem;
  margin: 0;
  color: #1e3a8a;
}

.stat-card-content p {
  margin: 0;
  color: #666;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.card-controls select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.view-all-link {
  color: #1e3a8a;
  font-weight: 500;
}

.chart-card {
  height: 400px;
}

.chart-placeholder {
  padding: 1.5rem;
  height: calc(100% - 70px);
  display: flex;
  flex-direction: column;
}

.chart-mock {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 1rem 0;
}

.chart-bar {
  width: 40px;
  background-color: #1e3a8a;
  border-radius: 4px 4px 0 0;
  position: relative;
}

.chart-value {
  position: absolute;
  top: -25px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.8rem;
  color: #666;
}

.chart-legend {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

.table-container {
  overflow-x: auto;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
}

.projects-table th,
.projects-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.projects-table th {
  color: #666;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-active {
  background-color: #e6f4ff;
  color: #1e88e5;
}

.status-completed {
  background-color: #e6f9ee;
  color: #26a69a;
}

.status-planned {
  background-color: #fff8e6;
  color: #f9a825;
}

.action-button {
  background-color: #e6f4ff;
  color: #1e3a8a;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.bottom-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.activity-list,
.deadline-list {
  padding: 1rem 0;
}

.activity-item {
  display: flex;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.activity-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.activity-text {
  margin: 0 0 0.25rem;
}

.activity-time {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.deadline-item {
  display: flex;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.deadline-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-right: 1rem;
}

.deadline-day {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e3a8a;
}

.deadline-month {
  font-size: 0.8rem;
  color: #666;
}

.deadline-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.deadline-content h4 {
  margin: 0 0 0.25rem;
}

.deadline-content p {
  margin: 0;
  color: #666;
}

@media (max-width: 768px) {
  .bottom-cards {
    grid-template-columns: 1fr;
  }
}
</style> 