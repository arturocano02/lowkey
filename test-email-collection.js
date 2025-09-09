// Comprehensive test for email collection system
const API_BASE = 'https://lowkey-flax.vercel.app';

async function testEmailCollection() {
  console.log('🧪 Testing Email Collection System...\n');

  // Test 1: Check if API is accessible
  console.log('1. Testing API accessibility...');
  try {
    const response = await fetch(`${API_BASE}/api/emails`);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, data);
    
    if (response.status === 500 && data.error === 'Failed to read emails') {
      console.log('   ❌ API is accessible but Supabase connection failed');
      console.log('   This suggests environment variables are not properly set');
    } else if (response.ok) {
      console.log('   ✅ API is working correctly');
    } else {
      console.log('   ❌ API returned unexpected response');
    }
  } catch (error) {
    console.log('   ❌ API is not accessible:', error.message);
  }

  // Test 2: Test email submission
  console.log('\n2. Testing email submission...');
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
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, data);
    
    if (response.ok) {
      console.log('   ✅ Email submission working');
    } else {
      console.log('   ❌ Email submission failed');
    }
  } catch (error) {
    console.log('   ❌ Email submission error:', error.message);
  }

  // Test 3: Check landing page
  console.log('\n3. Testing landing page...');
  try {
    const response = await fetch(`${API_BASE}/`);
    if (response.ok) {
      console.log('   ✅ Landing page accessible');
    } else {
      console.log('   ❌ Landing page failed:', response.status);
    }
  } catch (error) {
    console.log('   ❌ Landing page error:', error.message);
  }

  // Test 4: Check dashboard
  console.log('\n4. Testing dashboard...');
  try {
    const response = await fetch(`${API_BASE}/dashboard`);
    if (response.ok) {
      console.log('   ✅ Dashboard accessible');
    } else {
      console.log('   ❌ Dashboard failed:', response.status);
    }
  } catch (error) {
    console.log('   ❌ Dashboard error:', error.message);
  }

  console.log('\n🏁 Test Results Summary:');
  console.log('If you see "Invalid API key" errors, the issue is with environment variables.');
  console.log('If you see "Failed to read emails", the Supabase connection is not working.');
  console.log('\n📋 Next Steps:');
  console.log('1. Check Vercel environment variables are set correctly');
  console.log('2. Verify Supabase anon key is correct');
  console.log('3. Check Supabase database table exists');
  console.log('4. Try redeploying the application');
}

// Run the test
testEmailCollection();
