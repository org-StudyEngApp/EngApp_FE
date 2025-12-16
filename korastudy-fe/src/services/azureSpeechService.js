/**
 * Azure Speech Service Integration
 * Text-to-Speech for article content
 */

class AzureSpeechService {
  constructor() {
    // Azure Speech API configuration
    this.subscriptionKey = import.meta.env.VITE_AZURE_SPEECH_KEY || '';
    this.region = import.meta.env.VITE_AZURE_SPEECH_REGION || 'southeastasia';
    this.endpoint = `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  }

  /**
   * Convert text to speech using Azure Cognitive Services
   * @param {string} text - Text content to convert
   * @param {string} voice - Voice name (default: en-US-JennyNeural)
   * @returns {Promise<Blob>} Audio blob
   */
  async textToSpeech(text, voice = 'en-US-JennyNeural') {
    if (!this.subscriptionKey) {
      console.error('Azure Speech subscription key not configured');
      return null;
    }

    try {
      // Prepare SSML (Speech Synthesis Markup Language)
      const ssml = `
        <speak version='1.0' xml:lang='en-US'>
          <voice xml:lang='en-US' name='${voice}'>
            ${this.cleanTextForSpeech(text)}
          </voice>
        </speak>
      `.trim();

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        },
        body: ssml,
      });

      if (!response.ok) {
        throw new Error(`Azure Speech API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      return audioBlob;
    } catch (error) {
      console.error('Failed to generate speech:', error);
      return null;
    }
  }

  /**
   * Convert HTML content to plain text for speech
   * @param {string} htmlContent - HTML content
   * @returns {string} Plain text
   */
  htmlToText(htmlContent) {
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;
    
    // Remove script and style elements
    const scripts = temp.getElementsByTagName('script');
    const styles = temp.getElementsByTagName('style');
    
    for (let i = scripts.length - 1; i >= 0; i--) {
      scripts[i].remove();
    }
    
    for (let i = styles.length - 1; i >= 0; i--) {
      styles[i].remove();
    }
    
    return temp.textContent || temp.innerText || '';
  }

  /**
   * Clean text for speech synthesis
   * @param {string} text - Raw text
   * @returns {string} Cleaned text
   */
  cleanTextForSpeech(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000); // Azure limit is around 10k characters per request
  }

  /**
   * Get audio URL from blob
   * @param {Blob} audioBlob - Audio blob
   * @returns {string} Object URL
   */
  getBlobUrl(audioBlob) {
    return URL.createObjectURL(audioBlob);
  }

  /**
   * Generate audio from article content
   * @param {Object} article - Article object with htmlContent
   * @returns {Promise<string>} Audio URL
   */
  async generateAudioFromArticle(article) {
    try {
      // Extract text from HTML
      const text = this.htmlToText(article.htmlContent || article.content || '');
      
      if (!text) {
        console.error('No text content to convert');
        return null;
      }

      // Generate speech
      const audioBlob = await this.textToSpeech(text);
      
      if (!audioBlob) {
        return null;
      }

      // Create object URL
      const audioUrl = this.getBlobUrl(audioBlob);
      return audioUrl;
    } catch (error) {
      console.error('Failed to generate audio from article:', error);
      return null;
    }
  }

  /**
   * Available voices for different languages
   */
  static get VOICES() {
    return {
      EN_US_FEMALE: 'en-US-JennyNeural',
      EN_US_MALE: 'en-US-GuyNeural',
      EN_GB_FEMALE: 'en-GB-SoniaNeural',
      EN_GB_MALE: 'en-GB-RyanNeural',
      VI_VN_FEMALE: 'vi-VN-HoaiMyNeural',
      VI_VN_MALE: 'vi-VN-NamMinhNeural',
    };
  }
}

export default new AzureSpeechService();
