import axiosClient from './axiosClient';

/**
 * News Reading Service
 * API endpoints for news articles and topics
 */

const newsService = {
  /**
   * Get all news topics with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 100)
   * @param {string} params.sortBy - Sort field (default: title)
   * @param {string} params.sortDir - Sort direction (ASC, DESC)
   * @returns {Promise} Paginated topics
   */
  getAllTopics: async (params = {}) => {
    const defaultParams = {
      page: 0,
      size: 100, // Get all topics by default
      sortBy: 'title',
      sortDir: 'ASC',
      ...params
    };
    const response = await axiosClient.get('/api/v1/news-topics', { params: defaultParams });
    return response.data;
  },

  /**
   * Get topic by ID
   * @param {number} topicId - Topic ID
   * @returns {Promise} Topic details
   */
  getTopicById: async (topicId) => {
    const response = await axiosClient.get(`/api/v1/news-topics/${topicId}`);
    return response.data;
  },

  /**
   * Get articles with filters and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @param {number} params.newsTopicId - Filter by topic ID
   * @param {string} params.level - Filter by level (BEGINNER, INTERMEDIATE, ADVANCED)
   * @param {string} params.keyword - Search keyword
   * @param {string} params.sortBy - Sort field (publishedAt, title, createdAt)
   * @param {string} params.sortDir - Sort direction (ASC, DESC)
   * @returns {Promise} Paginated articles
   */
  getArticles: async (params = {}) => {
    const response = await axiosClient.get('/api/v1/articles', { params });
    return response.data;
  },

  /**
   * Get article by ID with error handling for HTTP 403
   * @param {number} articleId - Article ID
   * @returns {Promise} Article details or error object
   */
  getArticleById: async (articleId) => {
    try {
      const response = await axiosClient.get(`/api/v1/articles/${articleId}`);
      return { data: response.data, error: null };
    } catch (error) {
      // Handle HTTP 403 - Locked content (Premium required)
      if (error.response?.status === 403) {
        return {
          data: null,
          error: {
            status: 403,
            code: 'ARTICLE_ACCESS_DENIED',
            message: error.response.data?.message || 'Bài báo này chỉ dành cho tài khoản Premium. Vui lòng nâng cấp để đọc toàn bộ!',
            upgradeUrl: '/premium/pricing'
          }
        };
      }
      
      // Other errors
      throw error;
    }
  },

  /**
   * Get articles by topic ID
   * @param {number} topicId - Topic ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Paginated articles
   */
  getArticlesByTopic: async (topicId, params = {}) => {
    const response = await axiosClient.get(`/api/v1/articles/topic/${topicId}`, { params });
    return response.data;
  },

  /**
   * Get articles by series ID
   * @param {number} seriesId - Series ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Paginated articles
   */
  getArticlesBySeries: async (seriesId, params = {}) => {
    const response = await axiosClient.get(`/api/v1/articles/series/${seriesId}`, { params });
    return response.data;
  },

  /**
   * Increment article view count
   * @param {number} articleId - Article ID
   * @returns {Promise} Response with status and message
   */
  incrementViewCount: async (articleId) => {
    const response = await axiosClient.post(`/api/v1/articles/${articleId}/view`);
    return response.data;
  },

  /**
   * Track reading progress
   * @param {Object} params - Progress parameters
   * @param {number} params.articleId - Article ID
   * @param {number} params.progressPercentage - Progress (0-100)
   * @param {number} params.timeSpentSeconds - Time spent in seconds
   * @param {boolean} params.isCompleted - Is completed
   * @returns {Promise} Updated reading history
   */
  trackReadingProgress: async (params) => {
    const response = await axiosClient.post('/api/v1/reading-history/track', null, { params });
    return response.data;
  },

  /**
   * Get user's reading history
   * @param {Object} params - Query parameters
   * @returns {Promise} Paginated reading history
   */
  getReadingHistory: async (params = {}) => {
    const response = await axiosClient.get('/api/v1/reading-history', { params });
    return response.data;
  },

  /**
   * Get reading history for specific article
   * @param {number} articleId - Article ID
   * @returns {Promise} Reading history for article
   */
  getArticleReadingHistory: async (articleId) => {
    const response = await axiosClient.get(`/api/v1/reading-history/article/${articleId}`);
    return response.data;
  },

  /**
   * Get article read count
   * @param {number} articleId - Article ID
   * @returns {Promise} Read count
   */
  getArticleReadCount: async (articleId) => {
    const response = await axiosClient.get(`/api/v1/reading-history/article/${articleId}/read-count`);
    return response.data;
  },

  /**
   * Get comments for article
   * @param {number} articleId - Article ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Paginated comments
   */
  getArticleComments: async (articleId, params = {}) => {
    const response = await axiosClient.get(`/api/v1/article-comments/article/${articleId}`, { params });
    return response.data;
  },

  /**
   * Create comment
   * @param {Object} data - Comment data
   * @param {number} data.articleId - Article ID
   * @param {string} data.content - Comment content
   * @param {number} data.parentCommentId - Parent comment ID (for replies)
   * @returns {Promise} Created comment
   */
  createComment: async (data) => {
    const response = await axiosClient.post('/api/v1/article-comments', data);
    return response.data;
  },

  /**
   * Update comment
   * @param {number} commentId - Comment ID
   * @param {Object} data - Updated comment data
   * @returns {Promise} Updated comment
   */
  updateComment: async (commentId, data) => {
    const response = await axiosClient.put(`/api/v1/article-comments/${commentId}`, data);
    return response.data;
  },

  /**
   * Delete comment
   * @param {number} commentId - Comment ID
   * @returns {Promise} Deletion result
   */
  deleteComment: async (commentId) => {
    const response = await axiosClient.delete(`/api/v1/article-comments/${commentId}`);
    return response.data;
  },

  /**
   * Get user's comments
   * @param {Object} params - Query parameters
   * @returns {Promise} Paginated user comments
   */
  getMyComments: async (params = {}) => {
    const response = await axiosClient.get('/api/v1/article-comments/my-comments', { params });
    return response.data;
  },

  // ====================== TRANSLATION APIS ======================

  /**
   * Get stored translation (FREE - no quota required)
   * Returns pre-translated or cached translation from database
   * @param {number} articleId - Article ID
   * @returns {Promise} Translation data
   * Response: {
   *   vietnameseTranslation: string,
   *   translationType: "stored",
   *   cached: true,
   *   quotaMessage: string
   * }
   */
  getStoredTranslation: async (articleId) => {
    const response = await axiosClient.get(`/api/v1/articles/${articleId}/translation/stored`);
    return response.data;
  },

  /**
   * Translate article with AI (Quota limited: 1/day for free users)
   * Requires authentication. Calls Gemini API and caches result.
   * @param {number} articleId - Article ID
   * @returns {Promise} Translation data with quota info
   * Response: {
   *   vietnameseTranslation: string,
   *   translationType: "ai",
   *   cached: false,
   *   remainingAiTranslations: number,
   *   dailyLimit: number,
   *   quotaMessage: string
   * }
   * @throws {Error} 429 when daily quota exceeded
   */
  translateWithAI: async (articleId) => {
    const response = await axiosClient.post(`/api/v1/articles/${articleId}/translation/ai`);
    return response.data;
  },
};

export default newsService;
