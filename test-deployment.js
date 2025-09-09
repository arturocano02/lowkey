// Test script to verify the deployment works
const API_BASE = 'https://lowkey-flax.vercel.app';

async function testDeployment() {
  console.log('🧪 Testing Lowkey Deployment...\n');

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
      console.log('   Status:', response.status);
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
      console.log('   Status:', response.status);
      console.log('   Error:', data.error);
      if (data.debug) {
        console.log('   Debug:', data.debug);
      }
      if (data.details) {
        console.log('   Details:', data.details);
      }
    }
  } catch (error) {
    console.log('❌ POST /api/emails error:', error.message);
  }

  // Test 3: Landing page
  console.log('\n3. Testing landing page...');
  try {
    const response = await fetch(`${API_BASE}/`);
    if (response.ok) {
      console.log('✅ Landing page accessible');
    } else {
      console.log('❌ Landing page failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Landing page error:', error.message);
  }

  console.log('\n🏁 Test complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Visit: https://lowkey-flax.vercel.app');
  console.log('2. Submit an email');
  console.log('3. Check dashboard: https://lowkey-flax.vercel.app/dashboard (password: lowkey2025)');
  console.log('4. Check Supabase: https://supabase.com/dashboard/project/raaykthqnqnknjenjhif/editor/emails');
}

// Run the test
testDeployment();
