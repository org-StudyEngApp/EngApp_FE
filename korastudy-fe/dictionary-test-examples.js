/**
 * Dictionary Service Test Examples
 * 
 * File này chứa các ví dụ để test dictionaryService trong browser console
 * hoặc trong component React
 */

import dictionaryService from '../src/api/dictionaryService';

// ============================================
// Example 1: Basic word lookup
// ============================================
export const testBasicLookup = async () => {
  console.log('=== Test Basic Lookup ===');
  
  try {
    const result = await dictionaryService.lookupWord('hello');
    console.log('✅ Success:', result);
    /*
    Expected output:
    {
      word: "hello",
      phonetic: "/həˈloʊ/",
      audio: "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3",
      partOfSpeech: "interjection",
      meaning: "Xin chào, chào hỏi",
      exampleEn: "Hello, how are you?",
      exampleVi: "Xin chào, bạn khỏe không?",
      warning: null
    }
    */
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// ============================================
// Example 2: Word not found (404 error)
// ============================================
export const testWordNotFound = async () => {
  console.log('=== Test Word Not Found ===');
  
  try {
    const result = await dictionaryService.lookupWord('xyzabc123');
    console.log('Result:', result);
  } catch (error) {
    console.log('✅ Expected 404 error:', error.message);
    // Expected: "Từ 'xyzabc123' không tồn tại trong từ điển"
  }
};

// ============================================
// Example 3: Multiple words lookup
// ============================================
export const testMultipleWords = async () => {
  console.log('=== Test Multiple Words ===');
  
  const words = ['book', 'computer', 'technology', 'artificial', 'intelligence'];
  
  for (const word of words) {
    try {
      const result = await dictionaryService.lookupWord(word);
      console.log(`✅ ${word}:`, result.meaning);
    } catch (error) {
      console.error(`❌ ${word}:`, error.message);
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// ============================================
// Example 4: Play audio pronunciation
// ============================================
export const testAudioPlayback = async () => {
  console.log('=== Test Audio Playback ===');
  
  try {
    const result = await dictionaryService.lookupWord('hello');
    
    if (result.audio) {
      console.log('Playing audio:', result.audio);
      await dictionaryService.playAudio(result.audio);
      console.log('✅ Audio played successfully');
    } else {
      console.log('⚠️ No audio available for this word');
    }
  } catch (error) {
    console.error('❌ Audio playback error:', error);
  }
};

// ============================================
// Example 5: Handle partial success
// ============================================
export const testPartialSuccess = async () => {
  console.log('=== Test Partial Success ===');
  
  try {
    const result = await dictionaryService.lookupWord('example');
    
    if (result.warning) {
      console.log('⚠️ Warning:', result.warning);
    }
    
    console.log('Available data:');
    console.log('- Word:', result.word);
    console.log('- Phonetic:', result.phonetic || 'N/A');
    console.log('- Audio:', result.audio || 'N/A');
    console.log('- Part of Speech:', result.partOfSpeech || 'N/A');
    console.log('- Meaning:', result.meaning || 'N/A');
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// ============================================
// Example 6: React Component Usage
// ============================================
export const ReactComponentExample = `
import React, { useState } from 'react';
import dictionaryService from './api/dictionaryService';
import DictionaryModal from './components/NewsComponent/DictionaryModal';

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [dictionaryData, setDictionaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lookupWord = async (word) => {
    setShowModal(true);
    setLoading(true);
    setError(null);
    
    try {
      const data = await dictionaryService.lookupWord(word);
      setDictionaryData(data);
    } catch (err) {
      setError(err.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async (audioUrl) => {
    try {
      await dictionaryService.playAudio(audioUrl);
    } catch (err) {
      console.error('Audio playback failed:', err);
    }
  };

  return (
    <div>
      <button onClick={() => lookupWord('hello')}>
        Lookup "hello"
      </button>

      <DictionaryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        dictionaryData={dictionaryData}
        loading={loading}
        error={error}
        onPlayAudio={handlePlayAudio}
        onSaveWord={(wordData) => console.log('Save:', wordData)}
        isAuthenticated={true}
      />
    </div>
  );
};

export default MyComponent;
`;

// ============================================
// Example 7: Browser Console Testing
// ============================================
export const browserConsoleTest = `
// Copy-paste this into browser console after app is loaded

// Test 1: Basic lookup
const testLookup = async () => {
  const response = await fetch('http://localhost:8080/api/dictionary/lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN_HERE'
    },
    body: JSON.stringify({ word: 'hello' })
  });
  const data = await response.json();
  console.log(data);
};

testLookup();

// Test 2: Word not found
const testNotFound = async () => {
  const response = await fetch('http://localhost:8080/api/dictionary/lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ word: 'xyzabc123' })
  });
  console.log('Status:', response.status);
  const data = await response.json();
  console.log(data);
};

testNotFound();
`;

// ============================================
// Run all tests
// ============================================
export const runAllTests = async () => {
  console.log('🚀 Starting Dictionary Service Tests...\n');
  
  await testBasicLookup();
  console.log('\n---\n');
  
  await testWordNotFound();
  console.log('\n---\n');
  
  await testMultipleWords();
  console.log('\n---\n');
  
  await testAudioPlayback();
  console.log('\n---\n');
  
  await testPartialSuccess();
  console.log('\n---\n');
  
  console.log('✅ All tests completed!');
};

// Export for usage
export default {
  testBasicLookup,
  testWordNotFound,
  testMultipleWords,
  testAudioPlayback,
  testPartialSuccess,
  runAllTests,
  ReactComponentExample,
  browserConsoleTest,
};
