/**
 * 项目服务
 *
 * 提供项目管理相关功能：
 * - 获取项目列表
 * - 获取项目详情
 * - 创建/更新/删除项目
 */

import api from '../api';

export default {
  /**
   * 获取项目列表
   * @param {Object} params 查询参数
   * @param {number} params.limit 每页数量
   * @param {number} params.page 页码
   * @param {string} params.sort 排序方式
   * @param {string} params.search 搜索关键词
   * @param {string} params.status 项目状态过滤
   * @returns {Promise<Object>} 项目列表与分页信息
   */
  async getProjects(params = {}) {
    const response = await api.get('/projects', params);
    return response;
  },
  
  /**
   * 获取单个项目详情
   * @param {string} id 项目ID
   * @returns {Promise<Object>} 项目详情
   */
  async getProject(id) {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },
  
  /**
   * 创建新项目
   * @param {Object} projectData 项目数据
   * @returns {Promise<Object>} 创建的项目
   */
  async createProject(projectData) {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  
  /**
   * 更新项目
   * @param {string} id 项目ID
   * @param {Object} projectData 更新的项目数据
   * @returns {Promise<Object>} 更新后的项目
   */
  async updateProject(id, projectData) {
    const response = await api.put(`/api/projects/${id}`, projectData);
    return response.data;
  },
  
  /**
   * 删除项目
   * @param {string} id 要删除的项目ID
   * @returns {Promise<Object>} 操作结果
   */
  async deleteProject(id) {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },
  
  /**
   * 获取项目图片列表
   * @param {string} id 项目ID
   * @returns {Promise<Array>} 项目图片列表
   */
  async getProjectImages(id) {
    const response = await api.get(`/api/projects/${id}/images`);
    return response.data;
  },
  
  /**
   * 上传项目图片
   * @param {string} id 项目ID
   * @param {FormData} formData 包含图片的FormData
   * @returns {Promise<Object>} 上传结果
   */
  async uploadProjectImage(id, formData) {
    const response = await api.client.post(`/api/projects/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  /**
   * 获取已完成项目
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 已完成项目列表
   */
  async getCompletedProjects(params = {}) {
    return this.getProjects({
      ...params,
      status: '已完成'
    });
  },
  
  /**
   * 获取进行中项目
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 进行中项目列表
   */
  async getOngoingProjects(params = {}) {
    return this.getProjects({
      ...params,
      status: '进行中'
    });
  }
}; 