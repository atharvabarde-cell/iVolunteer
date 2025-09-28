import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function createTestNGOAndEvent() {
  try {
    console.log('🏗️ Creating test NGO user and event...\n');

    // Step 1: Register an NGO user
    const ngoData = {
      name: "Test Environmental Foundation",
      email: `test-ngo-${Date.now()}@example.com`,
      password: "testPassword123",
      role: "ngo",
      organizationType: "non-profit",
      websiteUrl: "https://test-environmental-foundation.org",
      yearEstablished: 2010,
      contactNumber: "+1234567890",
      address: {
        street: "123 Green Street",
        city: "Mumbai",
        state: "Maharashtra", 
        zip: "400001",
        country: "India"
      },
      ngoDescription: "We are dedicated to protecting the environment through community engagement and sustainable practices. Our mission is to create a greener future for all.",
      focusAreas: ["environment", "community-development"],
      organizationSize: "11-50"
    };

    console.log('📝 Registering NGO user...');
    const registrationResponse = await axios.post(`${BASE_URL}/auth/register`, ngoData);
    
    console.log('Registration response:', registrationResponse.data);
    
    if (!registrationResponse.data.user || !registrationResponse.data.tokens) {
      throw new Error(`NGO registration failed: ${registrationResponse.data.message}`);
    }
    
    console.log('✅ NGO user registered successfully');
    console.log('NGO User ID:', registrationResponse.data.user.userId);

    // Step 2: Login with NGO account
    console.log('🔐 Logging in with NGO account...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: ngoData.email,
      password: ngoData.password,
      role: "ngo"
    });

    const token = loginResponse.data?.tokens?.accessToken;
    if (!token) {
      throw new Error('Login failed - no token received');
    }

    console.log('✅ NGO login successful');

    // Step 3: Create an event
    const eventData = {
      title: "Beach Cleanup Drive - Test Event",
      description: "Join us for a community beach cleanup to protect marine life and keep our beaches beautiful. This is a test event to verify NGO details are properly displayed.",
      location: "Sunset Beach, Marine Drive",
      date: "2025-10-15T09:00:00Z",
      time: "09:00",
      duration: 4,
      category: "environmental",
      maxParticipants: 50,
      pointsOffered: 100,
      requirements: ["Comfortable clothing", "Sun protection", "Water bottle"],
      sponsorshipRequired: true,
      sponsorshipAmount: 5000
    };

    console.log('🎯 Creating test event...');
    const eventResponse = await axios.post(`${BASE_URL}/event/add-event`, eventData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    if (!eventResponse.data.success) {
      throw new Error('Event creation failed');
    }

    console.log('✅ Event created successfully');
    console.log('Event ID:', eventResponse.data.event._id);

    // Step 4: Test fetching the event with NGO details
    console.log('\n🔍 Testing single event endpoint...');
    const singleEventResponse = await axios.get(`${BASE_URL}/event/${eventResponse.data.event._id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    if (singleEventResponse.data.success && singleEventResponse.data.event) {
      const event = singleEventResponse.data.event;
      console.log('✅ Single event fetched successfully');
      console.log('📊 Event info:', {
        id: event._id,
        title: event.title,
        organization: event.organization,
        hasNGODetails: !!(event.organizationId && typeof event.organizationId === 'object'),
      });

      if (event.organizationId && typeof event.organizationId === 'object') {
        console.log('🏢 NGO Details populated:', {
          name: event.organizationId.name,
          email: event.organizationId.email,
          organizationType: event.organizationId.organizationType,
          websiteUrl: event.organizationId.websiteUrl,
          yearEstablished: event.organizationId.yearEstablished,
          contactNumber: event.organizationId.contactNumber,
          ngoDescription: event.organizationId.ngoDescription?.substring(0, 100) + '...',
          focusAreas: event.organizationId.focusAreas,
          organizationSize: event.organizationId.organizationSize,
          hasAddress: !!event.organizationId.address
        });
        
        console.log('\n🎉 SUCCESS: NGO details are properly populated!');
        console.log(`\n📱 Test the event details page at: http://localhost:3000/volunteer/${event._id}`);
      } else {
        console.log('❌ FAILURE: NGO details are not populated');
        console.log('organizationId value:', event.organizationId);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
createTestNGOAndEvent();