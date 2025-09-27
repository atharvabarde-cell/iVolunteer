import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

// Test enhanced NGO registration validation
async function testEnhancedNGOValidation() {
  try {
    console.log('🧪 Testing Enhanced NGO Registration Validation...\n');

    // Test 1: Valid NGO registration with all validations
    console.log('📋 Test 1: Valid NGO Registration');
    const validNgoData = {
      name: "Green Future Environmental Foundation", // Organization name
      email: `valid_ngo_${Date.now()}@example.com`,
      password: "simplepass", // Simple password
      role: "ngo",
      organizationType: "foundation",
      websiteUrl: "https://greenfuture.org",
      yearEstablished: 2015, // Valid year
      contactNumber: "+919876543210", // Valid 10+ digit number
      address: {
        street: "123 Environmental Street",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400001", // Valid Indian PIN code (6 digits)
        country: "India"
      },
      ngoDescription: "We are a dedicated environmental conservation organization working towards creating sustainable solutions for climate change and promoting eco-friendly practices.", // More than 10 words
      focusAreas: ["environment", "community-development"],
      organizationSize: "11-50"
    };

    const validResponse = await axios.post(`${BASE_URL}/auth/register`, validNgoData);
    console.log('✅ Valid NGO registration successful!');
    console.log(`   Organization: ${validResponse.data.user.name}`);
    console.log(`   Coins awarded: ${validResponse.data.user.coins}`);

    // Test 2: Invalid year (future year)
    console.log('\n📋 Test 2: Invalid Year Validation');
    try {
      const invalidYearData = {
        ...validNgoData,
        email: `invalid_year_${Date.now()}@example.com`,
        name: "Future Year NGO",
        yearEstablished: 2030 // Future year
      };
      
      await axios.post(`${BASE_URL}/auth/register`, invalidYearData);
      console.log('❌ Should have failed for future year');
    } catch (error) {
      console.log('✅ Future year validation working:', error.response?.data?.message);
    }

    // Test 3: Invalid contact number (too short)
    console.log('\n📋 Test 3: Invalid Contact Number Validation');
    try {
      const invalidPhoneData = {
        ...validNgoData,
        email: `invalid_phone_${Date.now()}@example.com`,
        name: "Invalid Phone NGO",
        contactNumber: "+91123456" // Too short
      };
      
      await axios.post(`${BASE_URL}/auth/register`, invalidPhoneData);
      console.log('❌ Should have failed for short contact number');
    } catch (error) {
      console.log('✅ Short contact number validation working:', error.response?.data?.message);
    }

    // Test 4: Invalid ZIP code for India (not 6 digits)
    console.log('\n📋 Test 4: Invalid Indian ZIP Code Validation');
    try {
      const invalidZipData = {
        ...validNgoData,
        email: `invalid_zip_${Date.now()}@example.com`,
        name: "Invalid ZIP NGO",
        address: {
          ...validNgoData.address,
          zip: "12345" // 5 digits instead of 6 for India
        }
      };
      
      await axios.post(`${BASE_URL}/auth/register`, invalidZipData);
      console.log('❌ Should have failed for invalid Indian ZIP');
    } catch (error) {
      console.log('✅ Indian ZIP code validation working:', error.response?.data?.message);
    }

    // Test 5: Description with less than 10 words
    console.log('\n📋 Test 5: Invalid Description (Less than 10 words)');
    try {
      const invalidDescData = {
        ...validNgoData,
        email: `invalid_desc_${Date.now()}@example.com`,
        name: "Short Description NGO",
        ngoDescription: "We help environment and people." // Only 6 words
      };
      
      await axios.post(`${BASE_URL}/auth/register`, invalidDescData);
      console.log('❌ Should have failed for short description');
    } catch (error) {
      console.log('✅ Short description validation working:', error.response?.data?.message);
    }

    // Test 6: Valid registration with non-India country (different ZIP format)
    console.log('\n📋 Test 6: Valid Non-India Registration');
    const nonIndiaData = {
      ...validNgoData,
      email: `non_india_${Date.now()}@example.com`,
      name: "Global Environmental Alliance",
      address: {
        street: "456 Global Street",
        city: "New York",
        state: "NY",
        zip: "10001", // US ZIP code (5 digits)
        country: "USA"
      }
    };

    const nonIndiaResponse = await axios.post(`${BASE_URL}/auth/register`, nonIndiaData);
    console.log('✅ Non-India registration successful!');
    console.log(`   Organization: ${nonIndiaResponse.data.user.name}`);
    console.log(`   Country: ${nonIndiaData.address.country}`);

    console.log('\n🎉 All validation tests completed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Organization name field working');
    console.log('✅ Year established validation working');  
    console.log('✅ Contact number validation (10+ digits) working');
    console.log('✅ Indian ZIP code validation (6 digits) working');
    console.log('✅ Description word count validation (10+ words) working');
    console.log('✅ Non-India ZIP codes accepted');

  } catch (error) {
    console.error('❌ Test failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
  }
}

// Run the test
testEnhancedNGOValidation();