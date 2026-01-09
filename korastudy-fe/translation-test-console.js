// 🧪 Translation Feature - Testing Guide
// File này để test các API endpoints trong browser console

const BASE_URL = 'http://localhost:8080';
const ARTICLE_ID = 1; // Thay bằng ID bài báo thật

// ==================== TEST STORED TRANSLATION (FREE) ====================

async function testStoredTranslation() {
  console.log('🧪 Testing: Get Stored Translation (FREE)');
  
  try {
    const response = await fetch(`${BASE_URL}/api/v1/articles/${ARTICLE_ID}/translation/stored`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Stored translation found');
      console.log('Translation type:', data.data.translationType);
      console.log('Quota message:', data.data.quotaMessage);
      console.log('Translation preview:', data.data.vietnameseTranslation.substring(0, 100) + '...');
    } else if (response.status === 404) {
      console.log('ℹ️ INFO: No stored translation available');
      console.log('Message:', data.message);
    } else {
      console.error('❌ ERROR:', data);
    }
  } catch (error) {
    console.error('❌ NETWORK ERROR:', error);
  }
}

// ==================== TEST AI TRANSLATION (QUOTA LIMITED) ====================

async function testAITranslation(token) {
  console.log('🧪 Testing: AI Translation with Quota');
  
  if (!token) {
    console.error('❌ ERROR: Token required! Login first and copy your JWT token.');
    console.log('💡 How to get token:');
    console.log('1. Login to the app');
    console.log('2. Open DevTools → Application → Local Storage');
    console.log('3. Copy the value of "auth_token" or "token"');
    console.log('4. Run: testAITranslation("YOUR_TOKEN_HERE")');
    return;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/v1/articles/${ARTICLE_ID}/translation/ai`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: AI translation completed');
      console.log('Translation type:', data.data.translationType);
      console.log('Remaining quota:', data.data.remainingAiTranslations + '/' + data.data.dailyLimit);
      console.log('Quota message:', data.data.quotaMessage);
      console.log('Translation preview:', data.data.vietnameseTranslation.substring(0, 100) + '...');
      
      // Warning if low quota
      if (data.data.remainingAiTranslations <= 3) {
        console.warn('⚠️ WARNING: Low quota remaining!');
      }
    } else if (response.status === 429) {
      console.error('❌ QUOTA EXCEEDED!');
      console.error('Message:', data.message);
      console.log('💡 Tip: Wait until tomorrow or upgrade to Premium');
    } else if (response.status === 401) {
      console.error('❌ UNAUTHORIZED: Token invalid or expired');
      console.log('💡 Tip: Login again to get a fresh token');
    } else {
      console.error('❌ ERROR:', data);
    }
  } catch (error) {
    console.error('❌ NETWORK ERROR:', error);
  }
}

// ==================== TEST QUOTA EXHAUSTION ====================

async function testQuotaExhaustion(token) {
  console.log('🧪 Testing: Quota Exhaustion (Call 11 times)');
  console.log('⚠️ This will use 10 of your daily quota!');
  console.log('Press Ctrl+C to cancel within 5 seconds...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  for (let i = 1; i <= 11; i++) {
    console.log(`\n--- Attempt ${i}/11 ---`);
    
    try {
      // Use different article IDs to test
      const testArticleId = ARTICLE_ID + i - 1;
      const response = await fetch(`${BASE_URL}/api/v1/articles/${testArticleId}/translation/ai`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Attempt ${i}: SUCCESS`);
        console.log(`   Remaining: ${data.data.remainingAiTranslations}/${data.data.dailyLimit}`);
      } else if (response.status === 429) {
        console.error(`❌ Attempt ${i}: QUOTA EXCEEDED! 🚫`);
        console.error(`   Message: ${data.message}`);
        console.log('\n🎉 Test completed! Quota limit working correctly.');
        break;
      } else if (response.status === 404) {
        console.warn(`⚠️ Attempt ${i}: Article ${testArticleId} not found, skipping...`);
        i--; // Don't count this attempt
      } else {
        console.error(`❌ Attempt ${i}: ERROR`, data);
      }
      
      // Wait 2s between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Attempt ${i}: NETWORK ERROR`, error);
    }
  }
}

// ==================== TEST CACHE MECHANISM ====================

async function testCacheMechanism(token) {
  console.log('🧪 Testing: Cache Mechanism');
  console.log('Step 1: Translate with AI (should call Gemini)');
  
  try {
    // First call - Should translate with AI
    const response1 = await fetch(`${BASE_URL}/api/v1/articles/${ARTICLE_ID}/translation/ai`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data1 = await response1.json();
    
    if (response1.ok) {
      console.log('✅ Step 1 SUCCESS: AI translation completed');
      console.log('   Type:', data1.data.translationType);
      console.log('   Remaining:', data1.data.remainingAiTranslations + '/' + data1.data.dailyLimit);
    } else {
      console.error('❌ Step 1 FAILED:', data1);
      return;
    }
    
    console.log('\nStep 2: Get stored translation (should return cached)');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Second call - Should get from cache
    const response2 = await fetch(`${BASE_URL}/api/v1/articles/${ARTICLE_ID}/translation/stored`);
    const data2 = await response2.json();
    
    if (response2.ok) {
      console.log('✅ Step 2 SUCCESS: Cached translation retrieved');
      console.log('   Type:', data2.data.translationType);
      console.log('   Cached:', data2.data.cached);
      console.log('   Quota message:', data2.data.quotaMessage);
      
      // Verify cache
      if (data2.data.cached === true) {
        console.log('\n🎉 Cache mechanism working correctly!');
      } else {
        console.warn('⚠️ WARNING: Cache flag not set correctly');
      }
    } else {
      console.error('❌ Step 2 FAILED:', data2);
    }
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
  }
}

// ==================== QUICK COMMANDS ====================

console.log(`
╔════════════════════════════════════════════════════════════╗
║         🎯 Translation Feature - Test Commands            ║
╚════════════════════════════════════════════════════════════╝

📋 Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  testStoredTranslation()
   → Test lấy bản dịch có sẵn (FREE, không cần token)

2️⃣  testAITranslation("YOUR_TOKEN")
   → Test dịch bằng AI (cần token)

3️⃣  testQuotaExhaustion("YOUR_TOKEN")
   → Test hết quota (call 11 lần)

4️⃣  testCacheMechanism("YOUR_TOKEN")
   → Test cache: AI translate → Get stored

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 How to use:
1. Copy this file content
2. Open browser DevTools Console (F12)
3. Paste and press Enter
4. Run the commands above

📌 Note: Update ARTICLE_ID variable to test with real articles
`);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testStoredTranslation,
    testAITranslation,
    testQuotaExhaustion,
    testCacheMechanism
  };
}
