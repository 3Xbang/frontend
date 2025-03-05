/**
 * API服务模块导出入口
 *
 * 统一导出所有API集成服务，便于在组件中统一引入
 */

import apiClient from './api';
import authService from './services/auth.service';
import projectService from './services/project.service';
import repairService from './services/repair.service';
import quoteService from './services/quote.service';

// 导出API客户端实例
export const api = apiClient;

// 导出服务模块
export const auth = authService;
export const projects = projectService;
export const repairs = repairService;
export const quotes = quoteService;

// 默认导出
export default {
  api: apiClient,
  auth: authService,
  projects: projectService,
  repairs: repairService,
  quotes: quoteService,
}; 