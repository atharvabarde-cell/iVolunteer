import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

// Test NGO registration with different websiteUrl scenarios
async function testNGORegistrationVariations() {
  try {
    console.log('🧪 Testing NGO Registration with Different Website URL Scenarios...\n');

    // Test 1: Empty websiteUrl
    console.log('📋 Test 1: NGO Registration with empty websiteUrl');
    const ngoDataEmpty = {
      name: "Empty URL Foundation",
      email: `ngo_empty_${Date.now()}@example.com`,
      password: "simplepass", // Simple password without numbers
      role: "ngo",
      organizationType: "foundation",
      websiteUrl: "", // Empty URL
      contactNumber: "+919876543210",
      address: {
        street: "123 Empty Street",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400001",
        country: "India"
      },
      ngoDescription: "We test empty URL functionality in NGO registration system.",
      focusAreas: ["environment"],
      organizationSize: "11-50"
    };

    const emptyResponse = await axios.post(`${BASE_URL}/auth/register`, ngoDataEmpty);
    console.log('✅ Empty websiteUrl test successful!');

    // Test 2: With valid websiteUrl
    console.log('\n📋 Test 2: NGO Registration with valid websiteUrl');
    const ngoDataWithUrl = {
      name: "With URL Foundation",
      email: `ngo_url_${Date.now()}@example.com`,
      password: "anotherpass", // Simple password
      role: "ngo",
      organizationType: "charity",
      websiteUrl: "https://example.org",
      contactNumber: "+919876543211",
      address: {
        street: "456 URL Street",
        city: "Delhi",
        state: "Delhi",
        zip: "110001",
        country: "India"
      },
      ngoDescription: "We test valid URL functionality in NGO registration system.",
      focusAreas: ["education", "health"],
      organizationSize: "1-10"
    };

    const urlResponse = await axios.post(`${BASE_URL}/auth/register`, ngoDataWithUrl);
    console.log('✅ Valid websiteUrl test successful!');

    // Test 3: With social media URL
    console.log('\n📋 Test 3: NGO Registration with social media URL');
    const ngoDataSocial = {
      name: "Social Media Foundation",
      email: `ngo_social_${Date.now()}@example.com`,
      password: "socialpass",
      role: "ngo",
      organizationType: "trust",
      websiteUrl: "https://facebook.com/socialmediafoundation",
      contactNumber: "+919876543212",
      address: {
        street: "789 Social Street",
        city: "Bangalore",
        state: "Karnataka",
        zip: "560001",
        country: "India"
      },
      ngoDescription: "We test social media URL functionality in NGO registration system.",
      focusAreas: ["community-development"],
      organizationSize: "51-100"
    };

    const socialResponse = await axios.post(`${BASE_URL}/auth/register`, ngoDataSocial);
    console.log('✅ Social media URL test successful!');

    console.log('\n🎉 All registration variations successful!');
    console.log('Summary:');
    console.log(`- Empty URL NGO: ${emptyResponse.data.user.name} (${emptyResponse.data.user.coins} coins)`);
    console.log(`- Website URL NGO: ${urlResponse.data.user.name} (${urlResponse.data.user.coins} coins)`);
    console.log(`- Social Media URL NGO: ${socialResponse.data.user.name} (${socialResponse.data.user.coins} coins)`);

    // Test password simplicity
    console.log('\n✅ Password validation relaxed - no number/letter requirement enforced');
    console.log('✅ Website URL is truly optional - empty values accepted');
    console.log('✅ Social media URLs accepted alongside website URLs');

  } catch (error) {
    console.error('❌ Test failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    if (error.response?.data?.message?.includes('Password')) {
      console.log('❌ Password validation issue detected');
    }
    
    if (error.response?.data?.message?.includes('websiteUrl')) {
      console.log('❌ Website URL validation issue detected');
    }
  }
}

// Run the test
testNGORegistrationVariations();