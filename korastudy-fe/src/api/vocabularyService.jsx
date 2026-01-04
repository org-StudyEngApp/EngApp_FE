import axiosClient from './axiosClient';

/**
 * Vocabulary Service
 * Handles vocabulary API calls for news articles
 */
const vocabularyService = {
  /**
   * Get all vocabularies for an article (User API)
   * @param {number} articleId - Article ID
   * @param {string} level - Optional: BEGINNER, INTERMEDIATE, ADVANCED
   * @returns {Promise<Object>} Vocabulary data grouped by level
   */
  async getArticleVocabularies(articleId, level = null) {
    try {
      const url = level 
        ? `/api/articles/${articleId}/vocabularies?level=${level}`
        : `/api/articles/${articleId}/vocabularies`;
      
      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vocabularies:', error);
      throw error;
    }
  },

  /**
   * Get vocabulary count for an article
   * @param {number} articleId - Article ID
   * @returns {Promise<Object>} Count data
   */
  async getVocabularyCount(articleId) {
    try {
      const response = await axiosClient.get(`/api/articles/${articleId}/vocabularies/count`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vocabulary count:', error);
      throw error;
    }
  },

  /**
   * Play audio pronunciation for a vocabulary word
   * @param {string} phonetic - Phonetic notation
   * @returns {Promise<void>}
   */
  async playPronunciation(word) {
    // Use browser's speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  },
};

export default vocabularyService;
