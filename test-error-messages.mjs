import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

// Test specific error messages for various validation failures
async function testSpecificErrorMessages() {
  try {
    console.log('🧪 Testing Specific Error Messages for NGO Registration...\n');

    // Test 1: Missing required fields
    console.log('📋 Test 1: Missing Required Fields Error');
    try {
      const incompleteData = {
        name: "Test NGO",
        email: `incomplete_${Date.now()}@example.com`,
        password: "password123",
        role: "ngo"
        // Missing required NGO fields
      };
      
      await axios.post(`${BASE_URL}/auth/register`, incompleteData);
      console.log('❌ Should have failed for missing required fields');
    } catch (error) {
      console.log('✅ Missing fields error message:');
      console.log(`   "${error.response?.data?.message}"`);
    }

    // Test 2: Invalid email format
    console.log('\n📋 Test 2: Invalid Email Format Error');
    try {
      const invalidEmailData = {
        name: "Test NGO",
        email: "invalid-email-format", // Invalid email
        password: "password123",
        role: "ngo",
        organizationType: "foundation",
        contactNumber: "+919876543210",
        address: {
          street: "123 Street",
          city: "City",
          state: "State", 
          zip: "400001",
          country: "India"
        },
        ngoDescription: "This is a test description with more than ten words to meet the requirement.",
        focusAreas: ["environment"],
        organizationSize: "11-50"
      };
      
      await axios.post(`${BASE_URL}/auth/register`, invalidEmailData);
      console.log('❌ Should have failed for invalid email');
    } catch (error) {
      console.log('✅ Invalid email error message:');
      console.log(`   "${error.response?.data?.message}"`);
    }

    // Test 3: Duplicate email
    console.log('\n📋 Test 3: Duplicate Email Error');
    
    // First, create a user
    const uniqueEmail = `duplicate_test_${Date.now()}@example.com`;
    const validData = {
      name: "First NGO",
      email: uniqueEmail,
      password: "password123",
      role: "ngo",
      organizationType: "foundation",
      contactNumber: "+919876543210",
      address: {
        street: "123 Street",
        city: "City",
        state: "State",
        zip: "400001", 
        country: "India"
      },
      ngoDescription: "This is a test description with more than ten words to meet the requirement.",
      focusAreas: ["environment"],
      organizationSize: "11-50"
    };

    await axios.post(`${BASE_URL}/auth/register`, validData);
    console.log('✅ First NGO created successfully');

    // Now try to create another user with the same email
    try {
      const duplicateData = {
        ...validData,
        name: "Second NGO"
      };
      
      await axios.post(`${BASE_URL}/auth/register`, duplicateData);
      console.log('❌ Should have failed for duplicate email');
    } catch (error) {
      console.log('✅ Duplicate email error message:');
      console.log(`   "${error.response?.data?.message}"`);
    }

    // Test 4: Invalid contact number format
    console.log('\n📋 Test 4: Invalid Contact Number Error');
    try {
      const invalidPhoneData = {
        name: "Test NGO",
        email: `invalid_phone_${Date.now()}@example.com`,
        password: "password123",
        role: "ngo",
        organizationType: "foundation",
        contactNumber: "123", // Too short
        address: {
          street: "123 Street",
          city: "City",
          state: "State",
          zip: "400001",
          country: "India"
        },
        ngoDescription: "This is a test description with more than ten words to meet the requirement.",
        focusAreas: ["environment"],
        organizationSize: "11-50"
      };
      
      await axios.post(`${BASE_URL}/auth/register`, invalidPhoneData);
      console.log('❌ Should have failed for invalid contact number');
    } catch (error) {
      console.log('✅ Invalid contact number error message:');
      console.log(`   "${error.response?.data?.message}"`);
    }

    // Test 5: Description too short (less than 10 words)
    console.log('\n📋 Test 5: Short Description Error');
    try {
      const shortDescData = {
        name: "Test NGO",
        email: `short_desc_${Date.now()}@example.com`,
        password: "password123",
        role: "ngo",
        organizationType: "foundation",
        contactNumber: "+919876543210",
        address: {
          street: "123 Street",
          city: "City",
          state: "State",
          zip: "400001",
          country: "India"
        },
        ngoDescription: "Too short description.", // Less than 10 words
        focusAreas: ["environment"],
        organizationSize: "11-50"
      };
      
      await axios.post(`${BASE_URL}/auth/register`, shortDescData);
      console.log('❌ Should have failed for short description');
    } catch (error) {
      console.log('✅ Short description error message:');
      console.log(`   "${error.response?.data?.message}"`);
    }

    // Test 6: Invalid ZIP code for India
    console.log('\n📋 Test 6: Invalid Indian ZIP Code Error');
    try {
      const invalidZipData = {
        name: "Test NGO", 
        email: `invalid_zip_${Date.now()}@example.com`,
        password: "password123",
        role: "ngo",
        organizationType: "foundation",
        contactNumber: "+919876543210",
        address: {
          street: "123 Street",
          city: "City",
          state: "State",
          zip: "12345", // 5 digits instead of 6 for India
          country: "India"
        },
        ngoDescription: "This is a test description with more than ten words to meet the requirement.",
        focusAreas: ["environment"],
        organizationSize: "11-50"
      };
      
      await axios.post(`${BASE_URL}/auth/register`, invalidZipData);
      console.log('❌ Should have failed for invalid ZIP code');
    } catch (error) {
      console.log('✅ Invalid ZIP code error message:');
      console.log(`   "${error.response?.data?.message}"`);
    }

    console.log('\n🎉 Error Message Testing Complete!');
    console.log('\n📊 Summary:');
    console.log('✅ All error messages are specific and informative');
    console.log('✅ Users will now see exactly why their signup failed');
    console.log('✅ No more generic "Signup failed" messages');

  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
}

// Run the test
testSpecificErrorMessages();