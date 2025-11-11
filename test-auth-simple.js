/**
 * Simple Auth Header Test
 * Checks what actually gets rendered
 */

async function testAuthHeaderSimple() {
  console.log('🧪 Simple Auth Header Test\n');
  console.log('='.repeat(70));

  // Step 1: Check if auth-header.js exists and what it does
  console.log('\n1️⃣ Checking auth-header.js content...\n');

  const scriptResponse = await fetch('https://evhenter.ai/js/auth-header.js');
  const scriptContent = await scriptResponse.text();

  console.log('Key functions in auth-header.js:');

  if (scriptContent.includes('initAuthHeader')) {
    console.log('   ✅ initAuthHeader() function exists');
  }

  if (scriptContent.includes('localStorage.getItem')) {
    console.log('   ✅ Reads from localStorage');
  }

  if (scriptContent.includes('evhenter_token')) {
    console.log('   ✅ Looks for evhenter_token');
  }

  if (scriptContent.includes('evhenter_user')) {
    console.log('   ✅ Looks for evhenter_user');
  }

  if (scriptContent.includes('querySelector(\'.nav\')')) {
    console.log('   ✅ Finds .nav element');
  }

  if (scriptContent.includes('Logg ut')) {
    console.log('   ✅ Creates "Logg ut" button when logged in');
  }

  if (scriptContent.includes('Logg inn')) {
    console.log('   ✅ Creates "Logg inn" link when logged out');
  }

  // Step 2: Check the events page HTML
  console.log('\n2️⃣ Checking events.html structure...\n');

  const pageResponse = await fetch('https://evhenter.ai/events.html');
  const pageContent = await pageResponse.text();

  if (pageContent.includes('<nav class="nav">')) {
    console.log('   ✅ Has <nav class="nav"> element');
  } else {
    console.log('   ❌ Missing <nav class="nav"> element');
  }

  if (pageContent.includes('auth-header.js')) {
    console.log('   ✅ Includes auth-header.js script');

    // Find where it's included
    const scriptMatch = pageContent.match(/<script[^>]*auth-header\.js[^>]*>/);
    if (scriptMatch) {
      console.log('      Script tag:', scriptMatch[0]);
    }
  } else {
    console.log('   ❌ Does NOT include auth-header.js');
  }

  // Step 3: Show what the default nav looks like
  console.log('\n3️⃣ Default nav HTML in events.html...\n');

  const navMatch = pageContent.match(/<nav class="nav">([\s\S]*?)<\/nav>/);
  if (navMatch) {
    console.log('   Default nav content:');
    console.log('   ' + navMatch[1].trim().replace(/\s+/g, ' '));
  }

  // Step 4: Simulate what happens with localStorage
  console.log('\n4️⃣ Simulating localStorage scenarios...\n');

  console.log('   SCENARIO A: User is NOT logged in');
  console.log('   ────────────────────────────────────');
  console.log('   localStorage.evhenter_token = null');
  console.log('   localStorage.evhenter_user = null');
  console.log('   ');
  console.log('   Expected header:');
  console.log('   [Arrangementer] [Logg inn]');
  console.log('');

  console.log('   SCENARIO B: User IS logged in');
  console.log('   ────────────────────────────────────');
  console.log('   localStorage.evhenter_token = "eyJhbGc..."');
  console.log('   localStorage.evhenter_user = {"name":"Test User",...}');
  console.log('   ');
  console.log('   Expected header:');
  console.log('   [Arrangementer] [👤 Test User] [Logg ut]');
  console.log('');

  // Step 5: Show the actual auth-header.js logic
  console.log('\n5️⃣ Key code from auth-header.js:\n');

  const keyLogic = scriptContent.match(/if \(token && user\) \{[\s\S]*?\} else \{[\s\S]*?\}/);
  if (keyLogic) {
    console.log('   The script does this:');
    console.log('   ────────────────────────────────────');
    const lines = keyLogic[0].split('\n').slice(0, 25);
    lines.forEach(line => {
      console.log('   ' + line);
    });
    console.log('   ...');
  }

  console.log('\n' + '='.repeat(70));
  console.log('📋 SUMMARY');
  console.log('='.repeat(70));

  console.log('\nThe auth-header.js script should:');
  console.log('');
  console.log('1. ✅ Load on every page (index, events, event-detail)');
  console.log('2. ✅ Check localStorage for evhenter_token and evhenter_user');
  console.log('3. ✅ Find the .nav element in the page');
  console.log('4. ✅ If logged in: Add user name + "Logg ut" button');
  console.log('5. ✅ If logged out: Add "Logg inn" link');
  console.log('');

  console.log('To test in your browser:');
  console.log('');
  console.log('1. Open https://evhenter.ai/events.html');
  console.log('2. Open DevTools (F12) → Console tab');
  console.log('3. Check current state:');
  console.log('   localStorage.getItem("evhenter_token")');
  console.log('   localStorage.getItem("evhenter_user")');
  console.log('');
  console.log('4. If you see null, the header should show "Logg inn"');
  console.log('5. If you see data, the header should show your name');
  console.log('');
  console.log('6. To manually test logged-in state, run:');
  console.log('   localStorage.setItem("evhenter_token", "fake-token");');
  console.log('   localStorage.setItem("evhenter_user", \'{"name":"Test"}\');');
  console.log('   window.evHenterAuth.initAuthHeader();');
  console.log('');
  console.log('7. To test logged-out state, run:');
  console.log('   localStorage.clear();');
  console.log('   window.evHenterAuth.initAuthHeader();');

  console.log('\n' + '='.repeat(70));
}

testAuthHeaderSimple().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
