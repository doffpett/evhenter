// Test parse endpoint with known token
async function test() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0ZGEwZTM5OC00MGEyLTQyNDYtYmRhYi1kNTNiZjEzNDZmZDUiLCJlbWFpbCI6InRlc3QtMTc2Mjg3Mzk1MTQ2N0BleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYyODczOTU0LCJleHAiOjE3NjM0Nzg3NTQsImF1ZCI6ImV2aGVudGVyLmFpIiwiaXNzIjoiZXZoZW50ZXIuYWkifQ.vG1tgYwg1SSmIzElvfreu6FipYa3V_GhALFVZ-_blxM';

  try {
    console.log('🔍 Testing AI URL Parsing...');
    console.log('   URL: https://www.bergen-chamber.no/arrangementer/samarbeid-med-startups/');
    console.log('   This may take 10-15 seconds...\n');

    const res = await fetch('https://evhenter.vercel.app/api/events/ai-parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        url: 'https://www.bergen-chamber.no/arrangementer/samarbeid-med-startups/'
      })
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.data) {
      console.log('\n✅ PARSED EVENT DATA:');
      console.log('   Title:', data.data.title);
      console.log('   Type:', data.data.eventType);
      console.log('   City:', data.data.city);
      console.log('   Date:', data.data.startDate);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
