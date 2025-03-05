/**
 * 报价服务
 *
 * 提供报价相关功能：
 * - 获取报价列表
 * - 获取报价详情
 * - 创建/更新/删除报价
 * - 接受/拒绝报价
 */

import api from '../api';

export default {
  /**
   * 获取报价列表
   * @param {Object} params 查询参数
   * @param {number} params.limit 每页数量 
   * @param {number} params.page 页码
   * @param {string} params.sort 排序方式
   * @param {string} params.status 状态过滤
   * @returns {Promise<Object>} 报价列表与分页信息
   */
  async getQuotes(params = {}) {
    const response = await api.get('/client/quotes', params);
    return response;
  },
  
  /**
   * 获取单个报价详情
   * @param {string} id 报价ID
   * @returns {Promise<Object>} 报价详情
   */
  async getQuote(id) {
    const response = await api.get(`/api/client/quotes/${id}`);
    return response.data;
  },
  
  /**
   * 创建新报价
   * @param {Object} quoteData 报价数据
   * @param {string} quoteData.projectType 项目类型
   * @param {string} quoteData.description 项目描述
   * @param {number} quoteData.estimatedBudget 预算估计
   * @param {string} quoteData.timeframe 时间要求
   * @param {string} quoteData.location 地点
   * @param {string} quoteData.contactName 联系人
   * @param {string} quoteData.contactPhone 联系电话
   * @param {string} quoteData.contactEmail 联系邮箱
   * @returns {Promise<Object>} 创建的报价
   */
  async createQuote(quoteData) {
    const response = await api.post('/client/quotes', quoteData);
    return response.data;
  },
  
  /**
   * 更新报价
   * @param {string} id 报价ID
   * @param {Object} quoteData 更新的报价数据
   * @returns {Promise<Object>} 更新后的报价
   */
  async updateQuote(id, quoteData) {
    const response = await api.put(`/api/client/quotes/${id}`, quoteData);
    return response.data;
  },
  
  /**
   * 删除报价
   * @param {string} id 要删除的报价ID
   * @returns {Promise<Object>} 操作结果
   */
  async deleteQuote(id) {
    const response = await api.delete(`/api/client/quotes/${id}`);
    return response.data;
  },
  
  /**
   * 接受报价
   * @param {string} id 报价ID
   * @returns {Promise<Object>} 更新后的报价
   */
  async acceptQuote(id) {
    const response = await api.post(`/api/client/quotes/${id}/accept`);
    return response.data;
  },
  
  /**
   * 拒绝报价
   * @param {string} id 报价ID
   * @param {Object} data 拒绝原因
   * @param {string} data.reason 拒绝原因
   * @returns {Promise<Object>} 更新后的报价
   */
  async rejectQuote(id, data = {}) {
    const response = await api.post(`/api/client/quotes/${id}/reject`, data);
    return response.data;
  },
  
  /**
   * 上传报价相关文件
   * @param {string} id 报价ID
   * @param {FormData} formData 包含文件的FormData
   * @returns {Promise<Object>} 上传结果
   */
  async uploadQuoteDocument(id, formData) {
    const response = await api.post(`/api/client/quotes/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  /**
   * 获取待处理的报价
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 待处理的报价列表
   */
  async getPendingQuotes(params = {}) {
    return this.getQuotes({
      ...params,
      status: '待处理'
    });
  },
  
  /**
   * 获取已接受的报价
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 已接受的报价列表
   */
  async getAcceptedQuotes(params = {}) {
    return this.getQuotes({
      ...params,
      status: '已接受'
    });
  },
  
  /**
   * 获取已拒绝的报价
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 已拒绝的报价列表
   */
  async getRejectedQuotes(params = {}) {
    return this.getQuotes({
      ...params,
      status: '已拒绝'
    });
  }
}; 