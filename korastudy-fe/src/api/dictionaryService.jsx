import axiosClient from './axiosClient';

/**
 * Dictionary Service
 * Handles dictionary lookup API calls
 */
const dictionaryService = {
  /**
   * Lookup a word in the dictionary (English-Vietnamese)
   * @param {string} word - The word to lookup
   * @returns {Promise<Object>} Dictionary data
   */
  async lookupWord(word) {
    try {
      const response = await axiosClient.post('/api/dictionary/lookup', {
        word: word.trim(),
      });
      return response.data;
    } catch (error) {
      console.error('Dictionary lookup error:', error);
      throw error;
    }
  },

  /**
   * Play audio pronunciation
   * @param {string} audioUrl - URL of the audio file
   * @returns {Promise<void>}
   */
  async playAudio(audioUrl) {
    if (!audioUrl) return;
    
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      throw new Error('Failed to play audio');
    }
  },
};

export default dictionaryService;
