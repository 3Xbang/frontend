/**
 * 维修申请服务
 *
 * 提供维修申请相关功能：
 * - 获取维修申请列表
 * - 获取维修申请统计
 * - 创建/更新/删除维修申请
 */

import api from '../api';

export default {
  /**
   * 获取维修申请列表
   * @param {Object} params 查询参数
   * @param {number} params.limit 每页数量 
   * @param {number} params.page 页码
   * @param {string} params.sort 排序方式
   * @param {string} params.status 状态过滤
   * @returns {Promise<Object>} 维修申请列表与分页信息
   */
  async getRepairs(params = {}) {
    const response = await api.get('/client/repairs', params);
    return response;
  },
  
  /**
   * 获取维修申请统计
   * @returns {Promise<Object>} 维修申请统计数据
   */
  async getRepairStats() {
    const response = await api.get('/client/repairs/stats');
    return response.data;
  },
  
  /**
   * 获取单个维修申请详情
   * @param {string} id 维修申请ID
   * @returns {Promise<Object>} 维修申请详情
   */
  async getRepair(id) {
    const response = await api.get(`/api/client/repairs/${id}`);
    return response.data;
  },
  
  /**
   * 创建新维修申请
   * @param {Object} repairData 维修申请数据
   * @param {string} repairData.title 标题
   * @param {string} repairData.description 描述
   * @param {string} repairData.urgency 紧急程度
   * @param {string} repairData.address 地址
   * @param {string} repairData.contactName 联系人
   * @param {string} repairData.contactPhone 联系电话
   * @param {Array<string>} [repairData.images] 图片URL数组
   * @returns {Promise<Object>} 创建的维修申请
   */
  async createRepair(repairData) {
    const response = await api.post('/client/repairs', repairData);
    return response.data;
  },
  
  /**
   * 更新维修申请
   * @param {string} id 维修申请ID
   * @param {Object} repairData 更新的维修申请数据
   * @returns {Promise<Object>} 更新后的维修申请
   */
  async updateRepair(id, repairData) {
    const response = await api.put(`/api/client/repairs/${id}`, repairData);
    return response.data;
  },
  
  /**
   * 删除维修申请
   * @param {string} id 要删除的维修申请ID
   * @returns {Promise<Object>} 操作结果
   */
  async deleteRepair(id) {
    const response = await api.delete(`/api/client/repairs/${id}`);
    return response.data;
  },
  
  /**
   * 上传维修申请图片
   * @param {string} id 维修申请ID
   * @param {FormData} formData 包含图片的FormData
   * @returns {Promise<Object>} 上传结果
   */
  async uploadRepairImage(id, formData) {
    const response = await api.client.post(`/api/client/repairs/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  /**
   * 获取待处理的维修申请
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 待处理的维修申请列表
   */
  async getPendingRepairs(params = {}) {
    return this.getRepairs({
      ...params,
      status: '待处理'
    });
  },
  
  /**
   * 获取进行中的维修申请
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 进行中的维修申请列表
   */
  async getInProgressRepairs(params = {}) {
    return this.getRepairs({
      ...params,
      status: '进行中'
    });
  },
  
  /**
   * 获取已完成的维修申请
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 已完成的维修申请列表
   */
  async getCompletedRepairs(params = {}) {
    return this.getRepairs({
      ...params,
      status: '已完成'
    });
  }
}; 