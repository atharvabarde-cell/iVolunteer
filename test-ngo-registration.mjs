import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

// Test NGO registration with all new fields
async function testNGORegistration() {
  try {
    console.log('🧪 Testing NGO Registration with Extended Fields...\n');

    // Prepare NGO registration data with all new fields
    const ngoData = {
      name: "Green Earth Foundation",
      email: `ngo_test_${Date.now()}@example.com`, // Unique email
      password: "password123", // Simple password without special requirements
      role: "ngo",
      organizationType: "foundation",
      websiteUrl: "", // Test with empty URL to ensure it's truly optional
      yearEstablished: 2010,
      contactNumber: "+919876543210",
      address: {
        street: "123 Green Street",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400001",
        country: "India"
      },
      ngoDescription: "We are dedicated to environmental conservation and promoting sustainable practices in communities across India. Our mission is to create awareness about climate change and encourage eco-friendly lifestyle choices.",
      focusAreas: ["environment", "community-development", "education"],
      organizationSize: "11-50"
    };

    console.log('📋 NGO Registration Data:', {
      name: ngoData.name,
      email: ngoData.email,
      role: ngoData.role,
      organizationType: ngoData.organizationType,
      websiteUrl: ngoData.websiteUrl,
      yearEstablished: ngoData.yearEstablished,
      contactNumber: ngoData.contactNumber,
      address: ngoData.address,
      ngoDescription: ngoData.ngoDescription.substring(0, 100) + '...',
      focusAreas: ngoData.focusAreas,
      organizationSize: ngoData.organizationSize
    });

    // Register the NGO
    console.log('🚀 Sending NGO registration request...');
    const registrationResponse = await axios.post(`${BASE_URL}/auth/register`, ngoData);

    console.log('✅ NGO Registration successful!');
    console.log('📊 Registration Response:', {
      userId: registrationResponse.data.user.userId,
      email: registrationResponse.data.user.email,
      name: registrationResponse.data.user.name,
      role: registrationResponse.data.user.role,
      coins: registrationResponse.data.user.coins,
      message: registrationResponse.data.message
    });

    // Login with the NGO account to verify it works
    console.log('\n🔐 Testing login with NGO account...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: ngoData.email,
      password: ngoData.password,
      role: "ngo"
    });

    const token = loginResponse.data?.tokens?.accessToken;
    if (!token) {
      console.log('❌ Login failed - no token received');
      return;
    }

    console.log('✅ NGO Login successful!');
    console.log('📊 Login Response:', {
      userId: loginResponse.data.user.userId,
      email: loginResponse.data.user.email,
      name: loginResponse.data.user.name,
      role: loginResponse.data.user.role,
      coins: loginResponse.data.user.coins
    });

    // Verify the NGO data was saved correctly by making an authenticated request
    console.log('\n🔍 Fetching NGO profile to verify saved data...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Profile fetch successful!');
      const userData = profileResponse.data.data.user;
      console.log('📊 Saved NGO Profile Data:', {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        organizationType: userData.organizationType,
        websiteUrl: userData.websiteUrl,
        yearEstablished: userData.yearEstablished,
        contactNumber: userData.contactNumber,
        address: userData.address,
        ngoDescription: userData.ngoDescription?.substring(0, 100) + '...',
        focusAreas: userData.focusAreas,
        organizationSize: userData.organizationSize,
        coins: userData.coins
      });

      // Verify all fields were saved
      const missingFields = [];
      if (!userData.organizationType) missingFields.push('organizationType');
      if (!userData.contactNumber) missingFields.push('contactNumber');
      if (!userData.address || !userData.address.street) missingFields.push('address');
      if (!userData.ngoDescription) missingFields.push('ngoDescription');
      if (!userData.focusAreas || userData.focusAreas.length === 0) missingFields.push('focusAreas');
      if (!userData.organizationSize) missingFields.push('organizationSize');

      if (missingFields.length === 0) {
        console.log('\n🎉 SUCCESS: All NGO-specific fields were saved correctly!');
        console.log('✨ Registration bonus awarded:', userData.coins, 'coins');
      } else {
        console.log('\n⚠️ WARNING: Some fields were not saved properly:', missingFields);
      }

    } catch (profileError) {
      if (profileError.response?.status === 404) {
        console.log('⚠️ User endpoint not available, but registration and login worked');
      } else {
        console.log('❌ Error fetching profile:', profileError.response?.data || profileError.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    if (error.response?.status === 400 && error.response?.data?.message?.includes('validation')) {
      console.log('\n🔍 Validation Details:');
      console.log(error.response.data);
    }
  }
}

// Run the test
testNGORegistration();