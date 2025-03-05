/**
 * Vue Router configuration for the 3XBANG construction company web application
 * Includes routes for both internal management and public-facing pages
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/userStore'

// Lazy load route components for better performance
const Home = () => import('../views/Home.vue')
// const About = () => import('../views/About.vue')
// const Projects = () => import('../views/Projects.vue')
// const ProjectDetail = () => import('../views/ProjectDetail.vue')
// const Contact = () => import('../views/Contact.vue')

// Admin/Internal routes
const AdminDashboard = () => import('../views/admin/Dashboard.vue')
// const AdminProjects = () => import('../views/admin/Projects.vue')
// const AdminClients = () => import('../views/admin/Clients.vue')
// const AdminEmployees = () => import('../views/admin/Employees.vue')
const Login = () => import('../views/Login.vue')
const RegisterInternal = () => import('../views/RegisterInternal.vue')
const RegisterClient = () => import('../views/RegisterClient.vue')
const InternalWorkspace = () => import('../views/InternalWorkspace.vue')
const InternalSalary = () => import('../views/internal/Salary.vue')
const InternalAttendance = () => import('../views/internal/Attendance.vue')
const InternalLeave = () => import('../views/internal/Leave.vue')

// Client routes
const ClientLogin = () => import('../views/Login.vue')
const ClientWorkflow = () => import('../views/client/ClientWorkflow.vue')
const ClientProjects = () => import('../views/client/Projects.vue')
const ClientProjectDetail = () => import('../views/client/ProjectDetail.vue')

// API集成示例组件
const ApiIntegrationExample = () => import('../components/ApiIntegrationExample.vue')

// 404 Page - use when page is not found
const NotFound = {
  template: `
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <router-link to="/">Return to Home</router-link>
    </div>
  `
}

const routes = [
  // Public routes
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { layout: 'default' }
  },
  /* Temporarily commenting out routes for non-existing components
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { layout: 'default' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: { layout: 'default' }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: ProjectDetail,
    meta: { layout: 'default' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { layout: 'default' }
  },
  */
  
  // API集成示例路由
  {
    path: '/api-example',
    name: 'ApiIntegrationExample',
    component: ApiIntegrationExample,
    meta: { layout: 'default' }
  },
  
  // Auth routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'blank' }
  },
  {
    path: '/client/login',
    name: 'ClientLogin',
    redirect: '/login',
    meta: { layout: 'blank' }
  },
  {
    path: '/register/internal',
    name: 'RegisterInternal',
    component: RegisterInternal,
    meta: { layout: 'blank' }
  },
  {
    path: '/register/client',
    name: 'RegisterClient',
    component: RegisterClient,
    meta: { layout: 'blank' }
  },
  
  // Admin/Internal routes
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresRole: 'internal', layout: 'admin' }
  },
  {
    path: '/internal/workspace',
    name: 'InternalWorkspace',
    component: InternalWorkspace,
    meta: { requiresAuth: true, requiresRole: 'internal', layout: 'admin' }
  },
  {
    path: '/internal/salary',
    name: 'InternalSalary',
    component: InternalSalary,
    meta: { requiresAuth: true, requiresRole: 'internal', layout: 'admin' }
  },
  {
    path: '/internal/attendance',
    name: 'InternalAttendance',
    component: InternalAttendance,
    meta: { requiresAuth: true, requiresRole: 'internal', layout: 'admin' }
  },
  {
    path: '/internal/leave',
    name: 'InternalLeave',
    component: InternalLeave,
    meta: { requiresAuth: true, requiresRole: 'internal', layout: 'admin' }
  },
  /* Temporarily commenting out routes for non-existing components
  {
    path: '/admin/projects',
    name: 'AdminProjects',
    component: AdminProjects,
    meta: { requiresAuth: true, requiresRole: 'internal', layout: 'admin' }
  },
  {
    path: '/admin/clients',
    name: 'AdminClients',
    component: AdminClients,
    meta: { requiresAuth: true, requiresRole: 'internal', layout: 'admin' }
  },
  {
    path: '/admin/employees',
    name: 'AdminEmployees',
    component: AdminEmployees,
    meta: { requiresAuth: true, requiresRole: 'internal', layout: 'admin' }
  },
  */
  
  // Client routes
  {
    path: '/client/workflow',
    name: 'ClientWorkflow',
    component: ClientWorkflow,
    meta: { requiresAuth: true, requiresRole: 'client', layout: 'client' }
  },
  {
    path: '/client/projects',
    name: 'ClientProjects',
    component: ClientProjects,
    meta: { requiresAuth: true, requiresRole: 'client', layout: 'client' }
  },
  {
    path: '/client/projects/:id',
    name: 'ClientProjectDetail',
    component: ClientProjectDetail,
    meta: { requiresAuth: true, requiresRole: 'client', layout: 'client' }
  },
  
  // 404 route - must be last
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { layout: 'blank' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check auth status
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  console.log('Navigation guard - Auth status:', userStore.isAuthenticated, 'User role:', userStore.userRole)
  
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if the user is authenticated
    if (!userStore.isAuthenticated) {
      console.log('User not authenticated, redirecting to login')
      next({ name: 'Login' })
      return
    }
    
    // Check if the route requires a specific role
    if (to.matched.some(record => record.meta.requiresRole)) {
      const requiredRole = to.matched.find(record => record.meta.requiresRole).meta.requiresRole
      console.log('Route requires role:', requiredRole, 'User role:', userStore.userRole)
      
      if (userStore.userRole !== requiredRole) {
        console.log('User does not have the required role, redirecting')
        // Redirect to appropriate dashboard based on role
        if (userStore.userRole === 'admin') {
          next({ name: 'AdminDashboard' })
        } else if (userStore.userRole === 'staff') {
          next({ name: 'InternalWorkspace' })
        } else if (userStore.userRole === 'client') {
          next({ name: 'ClientWorkflow' })
        } else {
          // Fallback to home if role is not recognized
          next({ name: 'Home' })
        }
        return
      }
    }
    
    // If all checks pass, proceed to the route
    next()
  } else {
    // For non-auth routes, check if the user is logged in and trying to access login page
    if (userStore.isAuthenticated && (to.name === 'Login' || to.name === 'ClientLogin')) {
      console.log('User already authenticated, redirecting to appropriate dashboard')
      // Redirect to appropriate dashboard based on role
      if (userStore.userRole === 'admin') {
        next({ name: 'AdminDashboard' })
      } else if (userStore.userRole === 'staff') {
        next({ name: 'InternalWorkspace' })
      } else if (userStore.userRole === 'client') {
        next({ name: 'ClientWorkflow' })
      } else {
        // Fallback to home if role is not recognized
        next({ name: 'Home' })
      }
      return
    }
    
    // For all other non-auth routes, proceed
    next()
  }
})

export default router 