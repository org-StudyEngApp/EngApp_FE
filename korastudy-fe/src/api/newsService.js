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
   * Get article by ID
   * @param {number} articleId - Article ID
   * @returns {Promise} Article details
   */
  getArticleById: async (articleId) => {
    const response = await axiosClient.get(`/api/v1/articles/${articleId}`);
    return response.data;
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
};

export default newsService;
