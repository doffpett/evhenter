// Test full auth flow including header display
async function testAuthFlow() {
  console.log('🧪 Testing Auth Flow with Header...\n');

  // Step 1: Register or login
  console.log('1️⃣ Testing Authentication...');
  let authData;

  try {
    const registerResponse = await fetch('https://evhenter.ai/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'headertest@evhenter.ai',
        password: 'TestPass123',
        name: 'Header Test User'
      })
    });

    if (!registerResponse.ok) {
      console.log('⚠️  User exists, trying login...');

      const loginResponse = await fetch('https://evhenter.ai/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'headertest@evhenter.ai',
          password: 'TestPass123'
        })
      });

      authData = await loginResponse.json();
      console.log('✅ Login successful');
    } else {
      authData = await registerResponse.json();
      console.log('✅ Registration successful');
    }

    console.log('   User:', authData.data.user.name || authData.data.user.email);
    console.log('   Token:', authData.data.token.substring(0, 50) + '...');

  } catch (error) {
    console.error('❌ Auth failed:', error.message);
    return;
  }

  // Step 2: Test /me endpoint
  console.log('\n2️⃣ Testing /api/auth/me...');
  try {
    const meResponse = await fetch('https://evhenter.ai/api/auth/me', {
      headers: {
        'Authorization': 'Bearer ' + authData.data.token
      }
    });

    const meData = await meResponse.json();
    console.log('✅ User profile retrieved');
    console.log('   Name:', meData.data.name);
    console.log('   Email:', meData.data.email);
    console.log('   Reputation:', meData.data.reputation);
  } catch (error) {
    console.error('❌ /me endpoint failed:', error.message);
  }

  // Step 3: Check if auth-header.js is deployed
  console.log('\n3️⃣ Checking auth-header.js deployment...');
  try {
    const scriptResponse = await fetch('https://evhenter.ai/js/auth-header.js');
    if (scriptResponse.ok) {
      console.log('✅ auth-header.js is deployed');
    } else {
      console.log('❌ auth-header.js not found (status:', scriptResponse.status + ')');
    }
  } catch (error) {
    console.error('❌ Failed to fetch auth-header.js:', error.message);
  }

  // Step 4: Check if pages include auth-header.js
  console.log('\n4️⃣ Checking page integration...');

  const pages = [
    { name: 'Homepage', url: 'https://evhenter.ai/' },
    { name: 'Events', url: 'https://evhenter.ai/events.html' },
    { name: 'Event Detail', url: 'https://evhenter.ai/event-detail.html' }
  ];

  for (const page of pages) {
    try {
      const response = await fetch(page.url);
      const html = await response.text();

      if (html.includes('auth-header.js')) {
        console.log('   ✅', page.name, '- includes auth-header.js');
      } else {
        console.log('   ❌', page.name, '- missing auth-header.js');
      }
    } catch (error) {
      console.log('   ❌', page.name, '- failed to load');
    }
  }

  // Summary and manual testing instructions
  console.log('\n' + '='.repeat(60));
  console.log('✅ AUTOMATED TESTS COMPLETE');
  console.log('='.repeat(60));

  console.log('\n📝 MANUAL TESTING INSTRUCTIONS:');
  console.log('\n1. Open Chrome DevTools (F12) at https://evhenter.ai/events.html');
  console.log('\n2. Go to Console tab and run these commands:');
  console.log('\n   localStorage.setItem("evhenter_token", "' + authData.data.token + '");');
  console.log('\n   localStorage.setItem("evhenter_user", \'' + JSON.stringify(authData.data.user) + '\');');
  console.log('\n3. Refresh the page (F5)');
  console.log('\n4. Look at top-right header - should show:');
  console.log('   "👤 Header Test User | Logg ut"');
  console.log('\n5. Click "Logg ut" button');
  console.log('   - Should show confirmation dialog');
  console.log('   - After confirming, redirects to homepage');
  console.log('   - Header should now show "Logg inn"');
  console.log('\n6. Go to https://evhenter.ai/auth.html');
  console.log('   - Login with: headertest@evhenter.ai / TestPass123');
  console.log('   - After login, should redirect to /events.html');
  console.log('   - Header should automatically show user name');
  console.log('\n' + '='.repeat(60));
}

testAuthFlow().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
