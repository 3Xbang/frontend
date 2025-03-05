/**
 * 3XBANG建筑公司 - 模拟后端服务器
 * 
 * 这个模拟服务器实现了所有前端需要的API端点，包括：
 * - 用户认证
 * - 客户工作流
 * - 内部员工系统 (薪资、考勤、请假)
 * - 管理功能
 */

// 导入依赖
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 简单的请求日志记录中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ====================================================
// 模拟数据
// ====================================================

// 用户数据
const users = [
  {
    id: 1,
    name: '管理员',
    email: 'admin@3xbang.com',
    password: 'admin123', // 实际应加密存储
    userRole: 'admin',
    permissionLevel: 'admin'
  },
  {
    id: 2,
    name: '员工小王',
    email: 'staff@3xbang.com',
    password: 'staff123',
    userRole: 'staff',
    permissionLevel: 'V1'
  },
  {
    id: 3,
    name: '客户公司A',
    email: 'client@example.com',
    password: 'client123',
    userRole: 'client',
    company: '示范建筑公司'
  }
];

// 项目数据
const projects = [
  {
    id: 1,
    clientId: 3,
    name: '办公楼装修工程',
    description: '5层办公楼整体装修，包含隔断、天花、地板、水电等',
    progress: 75,
    startDate: '2023-01-15',
    endDate: '2023-05-30',
    status: 'in_progress'
  },
  {
    id: 2,
    clientId: 3,
    name: '会议室改造项目',
    description: '将旧会议室改造为多功能会议厅，增加投影、音响等设备',
    progress: 40,
    startDate: '2023-03-10',
    endDate: '2023-06-15',
    status: 'in_progress'
  }
];

// 临时施工申请
const tempWorks = [
  {
    id: 1,
    clientId: 3,
    title: '电路改造',
    description: '增加6个电源插座以满足新设备需求',
    date: '2023-04-10',
    status: 'pending',
    statusText: '待审核'
  },
  {
    id: 2,
    clientId: 3,
    title: '安装新空调',
    description: '在会议室安装2台新风系统',
    date: '2023-04-05',
    status: 'approved',
    statusText: '已批准'
  },
  {
    id: 3,
    clientId: 3,
    title: '墙面粉刷',
    description: '大厅墙面重新粉刷为浅蓝色',
    date: '2023-03-28',
    status: 'completed',
    statusText: '已完成'
  }
];

// 维修申请
const repairs = [
  {
    id: 1,
    clientId: 3,
    title: '水管漏水',
    description: '卫生间水龙头处漏水',
    date: '2023-04-12',
    status: 'pending'
  },
  {
    id: 2,
    clientId: 3,
    title: '门锁损坏',
    description: '会议室A门锁无法正常使用',
    date: '2023-04-08',
    status: 'in_progress'
  },
  {
    id: 3,
    clientId: 3,
    title: '灯具更换',
    description: '前台照明灯具不亮',
    date: '2023-04-01',
    status: 'completed'
  }
];

// 报价
const quotes = [
  {
    id: 1,
    clientId: 3,
    title: '办公室扩建工程',
    description: '扩建现有办公区，增加10个工位',
    amount: 158000,
    status: 'pending',
    statusText: '待确认'
  },
  {
    id: 2,
    clientId: 3,
    title: '绿化改造',
    description: '入口处绿化改造，增加景观效果',
    amount: 36500,
    status: 'confirmed',
    statusText: '已确认'
  }
];

// 回执
const receipts = [
  {
    id: 1,
    clientId: 3,
    title: '消防系统检查',
    description: '年度消防系统检查与维护',
    date: '2023-04-08',
    status: 'pending',
    statusText: '待确认'
  },
  {
    id: 2,
    clientId: 3,
    title: '门禁系统安装',
    description: '新门禁系统安装完成确认单',
    date: '2023-03-25',
    status: 'confirmed',
    statusText: '已确认'
  }
];

// 员工薪资数据
const salaries = [
  {
    id: 1,
    employeeId: 2,
    month: '202310',
    baseSalary: 15000,
    overtime: 1200,
    bonus: 800,
    attendance: 500,
    deductions: 450,
    tax: 1500,
    insurance: 750,
    actualSalary: 14800,
    estimatedSalary: 16400,
    salaryTrend: 'up',
    trendReason: '本月加班多且无缺勤',
    paymentDate: '2023-11-05',
    paymentStatus: 'pending'
  },
  {
    id: 2,
    employeeId: 2,
    month: '202309',
    baseSalary: 15000,
    overtime: 800,
    bonus: 500,
    attendance: 500,
    deductions: 200,
    tax: 1450,
    insurance: 750,
    actualSalary: 14400,
    estimatedSalary: 14400,
    salaryTrend: 'stable',
    trendReason: '正常出勤',
    paymentDate: '2023-10-05',
    paymentStatus: 'completed'
  }
];

// 每日工作记录
const dailyWorkRecords = [
  {
    id: 1,
    employeeId: 2,
    date: '2023-10-01',
    weekday: '周一',
    clockIn: '08:05',
    clockOut: '17:30',
    workHours: 8,
    overtime: 1.5,
    overtimePay: 150,
    status: 'normal',
    note: '正常出勤'
  },
  {
    id: 2,
    employeeId: 2,
    date: '2023-10-02',
    weekday: '周二',
    clockIn: '08:15',
    clockOut: '17:30',
    workHours: 8,
    overtime: 0,
    overtimePay: 0,
    status: 'late',
    note: '迟到15分钟'
  },
  {
    id: 3,
    employeeId: 2,
    date: '2023-10-03',
    weekday: '周三',
    clockIn: '08:00',
    clockOut: '18:30',
    workHours: 9,
    overtime: 1,
    overtimePay: 100,
    status: 'overtime',
    note: '加班1小时'
  }
];

// 考勤记录
const attendance = {
  id: 1,
  employeeId: 2,
  month: '202310',
  stats: {
    normalDays: 18,
    lateDays: 2,
    earlyDays: 1,
    absentDays: 1,
    overtimeDays: 5
  },
  records: dailyWorkRecords,
  calendarDays: [
    // 日历数据，这里简化展示
    {
      date: '2023-10-01',
      weekday: '周一',
      type: 'workday',
      status: 'normal'
    },
    {
      date: '2023-10-02',
      weekday: '周二',
      type: 'workday',
      status: 'late'
    }
  ]
};

// 考勤更正申请
const attendanceCorrections = [
  {
    id: 1,
    employeeId: 2,
    date: '2023-10-05',
    type: 'clockIn',
    reason: '门禁卡失效，实际到岗时间为8:00',
    status: 'pending',
    approvedBy: null,
    actionDate: null
  }
];

// 请假申请
const leaveApplications = [
  {
    id: 1,
    employeeId: 2,
    type: 'sick',
    startDateTime: '2023-10-05 09:00',
    endDateTime: '2023-10-06 18:00',
    hours: 16,
    reason: '感冒发烧',
    status: 'approved',
    statusClass: 'status-approved',
    approvedBy: 1,
    actionDate: '2023-10-04 17:30'
  },
  {
    id: 2,
    employeeId: 2,
    type: 'personal',
    startDateTime: '2023-10-12 09:00',
    endDateTime: '2023-10-12 18:00',
    hours: 8,
    reason: '个人事务',
    status: 'pending',
    statusClass: 'status-pending',
    approvedBy: null,
    actionDate: null
  }
];

// ====================================================
// 辅助函数
// ====================================================

// 查找用户
function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

// 获取用户信息(不返回密码)
function getUserInfo(user) {
  const { password, ...userInfo } = user;
  return userInfo;
}

// ====================================================
// API端点
// ====================================================

// --------------------------------
// 认证相关API
// --------------------------------

// 登录
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  
  if (user && user.password === password) {
    res.json({ success: true, user: getUserInfo(user) });
  } else {
    res.status(401).json({ 
      success: false, 
      error: {
        code: 'INVALID_CREDENTIALS',
        message: '用户名或密码不正确' 
      }
    });
  }
});

// 登出
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// 会话检查
app.get('/api/auth/session', (req, res) => {
  // 实际应验证JWT令牌
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    // 这里简化处理，实际应该验证JWT令牌
    res.json({ isAuthenticated: true });
  } else {
    res.status(401).json({ 
      isAuthenticated: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '未登录或会话已过期'
      }
    });
  }
});

// --------------------------------
// 客户相关API
// --------------------------------

// 获取客户项目
app.get('/api/client/projects', (req, res) => {
  // 实际应从请求中识别客户ID
  const clientId = 3; // 默认客户ID
  const clientProjects = projects.filter(p => p.clientId === clientId);
  
  res.json({ 
    success: true,
    projects: clientProjects 
  });
});

// 获取临时施工记录
app.get('/api/client/temp-works', (req, res) => {
  const clientId = 3;
  const clientTempWorks = tempWorks.filter(t => t.clientId === clientId);
  
  res.json({ 
    success: true,
    tempWorks: clientTempWorks 
  });
});

// 提交临时施工申请
app.post('/api/client/temp-works', (req, res) => {
  const { title, description, expectedDate } = req.body;
  const clientId = 3;
  
  const newTempWork = {
    id: tempWorks.length + 1,
    clientId,
    title,
    description,
    date: expectedDate || new Date().toISOString().split('T')[0],
    status: 'pending',
    statusText: '待审核'
  };
  
  tempWorks.push(newTempWork);
  
  res.json({
    success: true,
    tempWork: newTempWork
  });
});

// 获取维修申请统计
app.get('/api/client/repairs/stats', (req, res) => {
  const clientId = 3;
  const clientRepairs = repairs.filter(r => r.clientId === clientId);
  
  const pending = clientRepairs.filter(r => r.status === 'pending').length;
  const inProgress = clientRepairs.filter(r => r.status === 'in_progress').length;
  const completed = clientRepairs.filter(r => r.status === 'completed').length;
  
  res.json({
    success: true,
    pending,
    inProgress,
    completed
  });
});

// 获取报价列表
app.get('/api/client/quotes', (req, res) => {
  const clientId = 3;
  const clientQuotes = quotes.filter(q => q.clientId === clientId);
  
  res.json({
    success: true,
    quotes: clientQuotes
  });
});

// 确认报价
app.put('/api/client/quotes/:id/confirm', (req, res) => {
  const quoteId = parseInt(req.params.id);
  const quoteIndex = quotes.findIndex(q => q.id === quoteId);
  
  if (quoteIndex !== -1) {
    quotes[quoteIndex].status = 'confirmed';
    quotes[quoteIndex].statusText = '已确认';
    
    res.json({
      success: true,
      quote: {
        id: quoteId,
        status: 'confirmed',
        statusText: '已确认'
      }
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '找不到指定报价'
      }
    });
  }
});

// 获取回执列表
app.get('/api/client/receipts', (req, res) => {
  const clientId = 3;
  const clientReceipts = receipts.filter(r => r.clientId === clientId);
  
  res.json({
    success: true,
    receipts: clientReceipts
  });
});

// 确认回执
app.put('/api/client/receipts/:id/confirm', (req, res) => {
  const receiptId = parseInt(req.params.id);
  const receiptIndex = receipts.findIndex(r => r.id === receiptId);
  
  if (receiptIndex !== -1) {
    receipts[receiptIndex].status = 'confirmed';
    receipts[receiptIndex].statusText = '已确认';
    
    res.json({
      success: true,
      receipt: {
        id: receiptId,
        status: 'confirmed',
        statusText: '已确认'
      }
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '找不到指定回执'
      }
    });
  }
});

// --------------------------------
// 员工内部系统API
// --------------------------------

// 获取薪资数据
app.get('/api/salary', (req, res) => {
  const employeeId = 2; // 默认员工ID
  const month = req.query.month || '202310'; // 默认查询当前月份
  
  const salaryData = salaries.find(s => s.employeeId === employeeId && s.month === month);
  
  if (salaryData) {
    // 添加日工作记录
    const monthDailyRecords = dailyWorkRecords.filter(r => 
      r.employeeId === employeeId && 
      r.date.startsWith(month.substring(0, 4) + '-' + month.substring(4))
    );
    
    const response = { ...salaryData, dailyRecords: monthDailyRecords };
    
    res.json({
      success: true,
      data: response
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '找不到指定月份的薪资数据'
      }
    });
  }
});

// 获取薪资历史
app.get('/api/salary/history', (req, res) => {
  const employeeId = 2;
  const limit = parseInt(req.query.limit) || 6;
  
  const history = salaries
    .filter(s => s.employeeId === employeeId)
    .sort((a, b) => b.month - a.month) // 按月份倒序
    .slice(0, limit)
    .map(s => ({
      month: s.month,
      totalSalary: s.actualSalary,
      baseSalary: s.baseSalary,
      overtime: s.overtime,
      bonus: s.bonus
    }));
  
  res.json({
    success: true,
    data: { history }
  });
});

// 获取考勤数据
app.get('/api/attendance', (req, res) => {
  const employeeId = 2;
  const month = req.query.month || '202310';
  
  if (attendance.employeeId === employeeId && attendance.month === month) {
    res.json({
      success: true,
      data: attendance
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '找不到指定月份的考勤数据'
      }
    });
  }
});

// 提交考勤更正
app.post('/api/attendance/correction', (req, res) => {
  const { date, type, reason } = req.body;
  const employeeId = 2;
  
  const newCorrection = {
    id: attendanceCorrections.length + 1,
    employeeId,
    date,
    type,
    reason,
    status: 'pending',
    approvedBy: null,
    actionDate: null
  };
  
  attendanceCorrections.push(newCorrection);
  
  res.json({
    success: true,
    message: '更正申请已提交，请等待审核'
  });
});

// 获取请假历史
app.get('/api/leave/history', (req, res) => {
  const employeeId = 2;
  
  const leaveHistory = leaveApplications
    .filter(l => l.employeeId === employeeId)
    .sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime));
  
  res.json({
    success: true,
    data: { leaveHistory }
  });
});

// 提交请假申请
app.post('/api/leave/apply', (req, res) => {
  const { type, startDate, startTime, endDate, endTime, reason } = req.body;
  const employeeId = 2;
  
  // 简化起见，自动批准请假
  const newLeave = {
    id: leaveApplications.length + 1,
    employeeId,
    type,
    startDateTime: `${startDate} ${startTime}`,
    endDateTime: `${endDate} ${endTime}`,
    hours: calculateHours(startDate, startTime, endDate, endTime),
    reason,
    status: '已批准',
    statusClass: 'status-approved',
    approvedBy: 1,
    actionDate: new Date().toISOString().slice(0, 16).replace('T', ' ')
  };
  
  leaveApplications.push(newLeave);
  
  res.json({
    success: true,
    data: {
      leaveId: newLeave.id,
      status: '已批准',
      message: '请假申请已自动批准'
    }
  });
});

// 取消请假申请
app.post('/api/leave/:id/cancel', (req, res) => {
  const leaveId = parseInt(req.params.id);
  const leaveIndex = leaveApplications.findIndex(l => l.id === leaveId);
  
  if (leaveIndex !== -1) {
    leaveApplications[leaveIndex].status = '已取消';
    leaveApplications[leaveIndex].statusClass = 'status-canceled';
    
    res.json({
      success: true,
      message: '请假申请已取消'
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '找不到指定请假申请'
      }
    });
  }
});

// --------------------------------
// 管理功能API
// --------------------------------

// 获取所有项目
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: { projects }
  });
});

// 获取项目详情
app.get('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = projects.find(p => p.id === projectId);
  
  if (project) {
    res.json({
      success: true,
      data: { project }
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '找不到指定项目'
      }
    });
  }
});

// 创建项目
app.post('/api/projects', (req, res) => {
  const newProject = {
    id: projects.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  projects.push(newProject);
  
  res.json({
    success: true,
    data: { project: newProject }
  });
});

// 更新项目
app.put('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex !== -1) {
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: { project: projects[projectIndex] }
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '找不到指定项目'
      }
    });
  }
});

// 删除项目
app.delete('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex !== -1) {
    projects.splice(projectIndex, 1);
    
    res.json({
      success: true
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '找不到指定项目'
      }
    });
  }
});

// ====================================================
// 辅助函数
// ====================================================

// 计算请假小时数
function calculateHours(startDate, startTime, endDate, endTime) {
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // 假设工作日8小时，减去午休时间
  let workHours = 0;
  let currentDay = new Date(start);
  
  while (currentDay <= end) {
    // 跳过周末
    const dayOfWeek = currentDay.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workHours += 8;
    }
    
    // 下一天
    currentDay.setDate(currentDay.getDate() + 1);
  }
  
  return workHours;
}

// ====================================================
// 启动服务器
// ====================================================

const PORT = 8080; // 修改端口为8080，避免与其他服务冲突
app.listen(PORT, () => {
  console.log(`3XBANG模拟服务器运行在 http://localhost:${PORT}`);
  console.log('可用测试账户:');
  console.log('- 管理员: admin@3xbang.com / admin123');
  console.log('- 员工: staff@3xbang.com / staff123');
  console.log('- 客户: client@example.com / client123');
}); 