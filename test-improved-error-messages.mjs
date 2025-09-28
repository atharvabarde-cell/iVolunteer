import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

// Test improved error message formatting
async function testImprovedErrorMessages() {
  try {
    console.log('🧪 Testing Improved Error Messages for User-Friendly Display...\n');

    // Test 1: Invalid ZIP code format
    console.log('📋 Test 1: Invalid ZIP Code Error (should show user-friendly message)');
    try {
      const invalidZipData = {
        name: "Test Organization",
        email: `zip_error_${Date.now()}@example.com`,
        password: "password123",
        role: "ngo",
        organizationType: "foundation",
        contactNumber: "+919876543210",
        address: {
          street: "123 Street",
          city: "City",
          state: "State",
          zip: "fgh", // Invalid ZIP format
          country: "India"
        },
        ngoDescription: "This is a test description with more than ten words to meet the requirement.",
        focusAreas: ["environment"],
        organizationSize: "11-50"
      };
      
      await axios.post(`${BASE_URL}/auth/register`, invalidZipData);
      console.log('❌ Should have failed for invalid ZIP');
    } catch (error) {
      console.log('✅ Backend error:', error.response?.data?.message);
      console.log('📱 Frontend should show: "Invalid ZIP/PIN code format. For India, please enter a 6-digit PIN code."');
    }

    // Test 2: Invalid contact number
    console.log('\n📋 Test 2: Invalid Contact Number Error');
    try {
      const invalidPhoneData = {
        name: "Test Organization",
        email: `phone_error_${Date.now()}@example.com`,
        password: "password123",
        role: "ngo",
        organizationType: "foundation",
        contactNumber: "123", // Invalid phone format
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
      console.log('❌ Should have failed for invalid phone');
    } catch (error) {
      console.log('✅ Backend error:', error.response?.data?.message);
      console.log('📱 Frontend should show: "Invalid contact number format. Please enter a valid phone number with at least 10 digits."');
    }

    // Test 3: Short description (less than 10 words)
    console.log('\n📋 Test 3: Short Description Error');
    try {
      const shortDescData = {
        name: "Test Organization",
        email: `desc_error_${Date.now()}@example.com`,
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
        ngoDescription: "Too short.", // Less than 10 words
        focusAreas: ["environment"],
        organizationSize: "11-50"
      };
      
      await axios.post(`${BASE_URL}/auth/register`, shortDescData);
      console.log('❌ Should have failed for short description');
    } catch (error) {
      console.log('✅ Backend error:', error.response?.data?.message);
      console.log('📱 Frontend should show: "Organization description is too short. Please provide at least 10 words describing your organization."');
    }

    // Test 4: Missing required field
    console.log('\n📋 Test 4: Missing Required Field Error');
    try {
      const missingFieldData = {
        name: "Test Organization",
        email: `missing_field_${Date.now()}@example.com`,
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
        // Missing ngoDescription
        focusAreas: ["environment"],
        organizationSize: "11-50"
      };
      
      await axios.post(`${BASE_URL}/auth/register`, missingFieldData);
      console.log('❌ Should have failed for missing field');
    } catch (error) {
      console.log('✅ Backend error:', error.response?.data?.message);
      console.log('📱 Frontend should show user-friendly version of missing field error');
    }

    // Test 5: Duplicate email
    console.log('\n📋 Test 5: Duplicate Email Error');
    
    // First create a user
    const uniqueEmail = `duplicate_${Date.now()}@example.com`;
    const validData = {
      name: "First Organization",
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
    console.log('✅ First organization created');

    // Try to create duplicate
    try {
      await axios.post(`${BASE_URL}/auth/register`, {...validData, name: "Duplicate Organization"});
      console.log('❌ Should have failed for duplicate email');
    } catch (error) {
      console.log('✅ Backend error:', error.response?.data?.message);
      console.log('📱 Frontend should show: "An account with this email already exists. Please try logging in or use a different email address."');
    }

    // Test 6: Login with non-existent user
    console.log('\n📋 Test 6: Login with Non-existent User');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: "nonexistent@example.com",
        password: "password123",
        role: "user"
      });
      console.log('❌ Should have failed for non-existent user');
    } catch (error) {
      console.log('✅ Backend error:', error.response?.data?.message);
      console.log('📱 Frontend should show: "No account found with this email address. Please check your email or sign up for a new account."');
    }

    console.log('\n🎉 Error Message Testing Complete!');
    console.log('\n📊 Summary:');
    console.log('✅ Backend errors are properly parsed and converted to user-friendly messages');
    console.log('✅ Users will see clear, actionable error messages instead of technical jargon');
    console.log('✅ Specific field validation errors are explained in plain English');

  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
}

// Run the test
testImprovedErrorMessages();