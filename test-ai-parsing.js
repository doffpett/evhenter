/**
 * Test AI URL Parsing
 */

async function test() {
  try {
    console.log('🧪 Testing AI URL Parsing...\n');

    // Step 1: Register new user
    console.log('1️⃣ Registering test user...');
    const registerResponse = await fetch('https://evhenter.vercel.app/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123',
        name: 'AI Test User'
      })
    });

    if (!registerResponse.ok) {
      console.log('❌ Registration failed:', registerResponse.status);
      const text = await registerResponse.text();
      console.log('   Response:', text);
      return;
    }

    const registerData = await registerResponse.json();
    console.log('✅ Registration successful');
    console.log('   User:', registerData.data?.user?.email);
    console.log('   Token:', registerData.data?.token?.substring(0, 50) + '...\n');

    const token = registerData.data.token;

    // Step 2: Parse URL
    console.log('2️⃣ Parsing event URL with AI...');
    console.log('   URL: https://www.bergen-chamber.no/arrangementer/samarbeid-med-startups/');
    console.log('   This may take 10-15 seconds...\n');

    const parseResponse = await fetch('https://evhenter.vercel.app/api/parse-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        url: 'https://www.bergen-chamber.no/arrangementer/samarbeid-med-startups/'
      })
    });

    console.log('   Status:', parseResponse.status);

    if (!parseResponse.ok) {
      const errorText = await parseResponse.text();
      console.log('❌ Parse failed');
      console.log('   Response:', errorText);
      return;
    }

    const parseData = await parseResponse.json();
    console.log('✅ Parse successful!\n');
    console.log('📋 Parsed Event Data:');
    console.log('   Title:', parseData.data?.title);
    console.log('   Type:', parseData.data?.eventType);
    console.log('   City:', parseData.data?.city);
    console.log('   Date:', parseData.data?.startDate);
    console.log('   Venue:', parseData.data?.venueName);
    console.log('   Free:', parseData.data?.isFree);
    if (parseData.data?.priceMin) {
      console.log('   Price:', `${parseData.data.priceMin} NOK`);
    }
    console.log('   Description:', parseData.data?.description?.substring(0, 150) + '...');
    console.log('\n🎉 AI URL parsing is working perfectly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Stack:', error.stack);
  }
}

test();
