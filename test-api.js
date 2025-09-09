// Simple test script to verify API endpoints
const API_BASE = 'https://lowkey-flax.vercel.app';

async function testAPI() {
  console.log('🧪 Testing Lowkey API endpoints...\n');

  // Test 1: GET emails
  console.log('1. Testing GET /api/emails...');
  try {
    const response = await fetch(`${API_BASE}/api/emails`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ GET /api/emails working');
      console.log(`   Found ${data.count} emails`);
    } else {
      console.log('❌ GET /api/emails failed');
      console.log('   Error:', data.error);
      if (data.debug) {
        console.log('   Debug:', data.debug);
      }
    }
  } catch (error) {
    console.log('❌ GET /api/emails error:', error.message);
  }

  // Test 2: POST email
  console.log('\n2. Testing POST /api/emails...');
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const response = await fetch(`${API_BASE}/api/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        userAgent: 'Test Script'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ POST /api/emails working');
      console.log(`   Added email: ${testEmail}`);
      console.log(`   Total count: ${data.count}`);
    } else {
      console.log('❌ POST /api/emails failed');
      console.log('   Error:', data.error);
      if (data.debug) {
        console.log('   Debug:', data.debug);
      }
    }
  } catch (error) {
    console.log('❌ POST /api/emails error:', error.message);
  }

  // Test 3: Backup endpoint
  console.log('\n3. Testing GET /api/backup...');
  try {
    const response = await fetch(`${API_BASE}/api/backup`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ GET /api/backup working');
      console.log(`   Database: ${data.database}`);
      console.log(`   Current emails: ${data.currentEmails}`);
    } else {
      console.log('❌ GET /api/backup failed');
      console.log('   Error:', data.error);
    }
  } catch (error) {
    console.log('❌ GET /api/backup error:', error.message);
  }

  console.log('\n🏁 Test complete!');
}

// Run the test
testAPI();
