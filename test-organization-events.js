// Test script to check the organization events endpoint
const axios = require('axios');

async function testOrganizationEvents() {
  try {
    // You'll need to replace this with a valid token from an NGO login
    const token = 'YOUR_NGO_AUTH_TOKEN_HERE';
    
    console.log('Testing /api/v1/event/organization endpoint...');
    
    const response = await axios.get('http://localhost:5000/api/v1/event/organization', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error testing endpoint:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  }
}

// testOrganizationEvents();
console.log('To use this test script:');
console.log('1. Replace YOUR_NGO_AUTH_TOKEN_HERE with a valid NGO auth token');
console.log('2. Uncomment the testOrganizationEvents() call');
console.log('3. Run: node test-organization-events.js');