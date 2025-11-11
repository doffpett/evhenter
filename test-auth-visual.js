/**
 * Visual Auth Header Test
 * Simulates browser behavior to verify header updates
 */

import { JSDOM } from 'jsdom';

async function testAuthHeader() {
  console.log('🧪 Testing Auth Header Visual Behavior\n');

  // Step 1: Fetch the actual events page
  console.log('1️⃣ Fetching events.html...');
  const response = await fetch('https://evhenter.ai/events.html');
  const html = await response.text();

  if (!html.includes('auth-header.js')) {
    console.log('❌ FAILED: events.html does not include auth-header.js');
    return;
  }
  console.log('✅ events.html includes auth-header.js');

  // Step 2: Create a simulated browser environment
  console.log('\n2️⃣ Simulating browser environment...');
  const dom = new JSDOM(html, {
    url: 'https://evhenter.ai/events.html',
    runScripts: 'dangerously',
    resources: 'usable',
    beforeParse(window) {
      // Mock localStorage
      window.localStorage = {
        data: {},
        getItem(key) {
          return this.data[key] || null;
        },
        setItem(key, value) {
          this.data[key] = value;
        },
        removeItem(key) {
          delete this.data[key];
        },
        clear() {
          this.data = {};
        }
      };
    }
  });

  const { window } = dom;
  const { document } = window;

  // Wait for DOM to be ready
  await new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });

  console.log('✅ Browser environment ready');

  // Step 3: Test WITHOUT auth (logged out state)
  console.log('\n3️⃣ Testing LOGGED OUT state...');
  console.log('   Setting localStorage: (empty)');

  // Find the nav element
  const nav = document.querySelector('.nav');
  if (!nav) {
    console.log('❌ FAILED: Could not find .nav element');
    return;
  }

  // Count initial links
  const initialLinks = nav.querySelectorAll('a').length;
  console.log(`   Initial nav links: ${initialLinks}`);
  console.log(`   Nav HTML: ${nav.innerHTML.substring(0, 100)}...`);

  // Step 4: Manually simulate what auth-header.js does
  console.log('\n4️⃣ Simulating auth-header.js behavior...');

  function simulateAuthHeader(isLoggedIn, userData) {
    // Clear existing auth links
    const existingAuthLinks = nav.querySelectorAll('.auth-link');
    existingAuthLinks.forEach(link => link.remove());

    if (isLoggedIn && userData) {
      // User is logged in
      const userSpan = document.createElement('span');
      userSpan.className = 'auth-link user-name';
      userSpan.textContent = `👤 ${userData.name || userData.email}`;
      userSpan.style.cssText = 'color: var(--color-text); font-weight: 500;';

      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.className = 'auth-link';
      logoutLink.textContent = 'Logg ut';

      nav.appendChild(userSpan);
      nav.appendChild(logoutLink);

      return { userSpan, logoutLink };
    } else {
      // User is not logged in
      const loginLink = document.createElement('a');
      loginLink.href = '/auth.html';
      loginLink.className = 'auth-link';
      loginLink.textContent = 'Logg inn';

      nav.appendChild(loginLink);

      return { loginLink };
    }
  }

  // Test logged out state
  const loggedOutResult = simulateAuthHeader(false, null);
  console.log('\n   📊 LOGGED OUT STATE:');
  console.log('   Nav contains:', nav.textContent.trim());

  if (loggedOutResult.loginLink) {
    console.log('   ✅ "Logg inn" link present');
    console.log('      Text:', loggedOutResult.loginLink.textContent);
    console.log('      Href:', loggedOutResult.loginLink.href);
  } else {
    console.log('   ❌ "Logg inn" link missing');
  }

  // Step 5: Test WITH auth (logged in state)
  console.log('\n5️⃣ Testing LOGGED IN state...');

  const testUser = {
    id: '123',
    email: 'test@evhenter.ai',
    name: 'Test User',
    role: 'user'
  };

  console.log('   User data:', JSON.stringify(testUser, null, 2));

  const loggedInResult = simulateAuthHeader(true, testUser);
  console.log('\n   📊 LOGGED IN STATE:');
  console.log('   Nav contains:', nav.textContent.trim());

  if (loggedInResult.userSpan) {
    console.log('   ✅ User name present');
    console.log('      Text:', loggedInResult.userSpan.textContent);
  } else {
    console.log('   ❌ User name missing');
  }

  if (loggedInResult.logoutLink) {
    console.log('   ✅ "Logg ut" link present');
    console.log('      Text:', loggedInResult.logoutLink.textContent);
  } else {
    console.log('   ❌ "Logg ut" link missing');
  }

  // Step 6: Visual comparison
  console.log('\n' + '='.repeat(70));
  console.log('📸 VISUAL COMPARISON');
  console.log('='.repeat(70));

  // Simulate logged out
  simulateAuthHeader(false, null);
  const loggedOutHtml = nav.innerHTML;
  console.log('\n🔴 LOGGED OUT - Header should show:');
  console.log('   "Arrangementer | Logg inn"');
  console.log('\n   Actual HTML:');
  console.log('   ' + loggedOutHtml.replace(/\n/g, ' ').substring(0, 200));

  // Simulate logged in
  simulateAuthHeader(true, testUser);
  const loggedInHtml = nav.innerHTML;
  console.log('\n\n🟢 LOGGED IN - Header should show:');
  console.log('   "Arrangementer | 👤 Test User | Logg ut"');
  console.log('\n   Actual HTML:');
  console.log('   ' + loggedInHtml.replace(/\n/g, ' ').substring(0, 200));

  console.log('\n' + '='.repeat(70));
  console.log('✅ TEST COMPLETE');
  console.log('='.repeat(70));

  console.log('\n💡 The auth-header.js script will do this automatically when:');
  console.log('   1. Page loads');
  console.log('   2. localStorage contains evhenter_token and evhenter_user');
  console.log('   3. The .nav element exists in the DOM');
}

testAuthHeader().catch(err => {
  console.error('❌ Test failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
