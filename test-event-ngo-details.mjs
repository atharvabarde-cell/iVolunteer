import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function testEventDetailsWithNGO() {
  try {
    console.log('🔍 Testing event details with NGO information...\n');
    
    // First, get all events to find one to test with
    console.log('📋 Fetching all events...');
    const eventsResponse = await axios.get(`${BASE_URL}/event/all-event`);
    
    const events = eventsResponse.data.events;
    if (!events || events.length === 0) {
      console.log('❌ No events found to test with');
      return;
    }
    
    console.log(`✅ Found ${events.length} events`);
    
    // Test the first event
    const testEvent = events[0];
    console.log(`\n🎯 Testing event: "${testEvent.title}"`);
    console.log('📊 Event basic info:', {
      id: testEvent._id,
      title: testEvent.title,
      organization: testEvent.organization,
      organizationId: testEvent.organizationId?._id || testEvent.organizationId
    });
    
    // Check if organizationId is populated with NGO details
    if (testEvent.organizationId && typeof testEvent.organizationId === 'object') {
      console.log('\n✅ NGO details are populated!');
      console.log('🏢 NGO Information:', {
        name: testEvent.organizationId.name,
        email: testEvent.organizationId.email,
        organizationType: testEvent.organizationId.organizationType,
        websiteUrl: testEvent.organizationId.websiteUrl,
        yearEstablished: testEvent.organizationId.yearEstablished,
        contactNumber: testEvent.organizationId.contactNumber,
        ngoDescription: testEvent.organizationId.ngoDescription?.substring(0, 100) + '...',
        focusAreas: testEvent.organizationId.focusAreas,
        organizationSize: testEvent.organizationId.organizationSize,
        hasAddress: !!testEvent.organizationId.address
      });
      
      if (testEvent.organizationId.address) {
        console.log('📍 Address:', {
          street: testEvent.organizationId.address.street,
          city: testEvent.organizationId.address.city,
          state: testEvent.organizationId.address.state,
          zip: testEvent.organizationId.address.zip,
          country: testEvent.organizationId.address.country
        });
      }
    } else {
      console.log('❌ NGO details are NOT populated (organizationId is just an ID)');
      console.log('organizationId value:', testEvent.organizationId);
    }

    // Test the new single event endpoint if available
    try {
      console.log(`\n🔍 Testing single event endpoint for event: ${testEvent._id}`);
      const singleEventResponse = await axios.get(`${BASE_URL}/event/${testEvent._id}`);
      
      if (singleEventResponse.data.success && singleEventResponse.data.event) {
        const event = singleEventResponse.data.event;
        console.log('✅ Single event endpoint works!');
        console.log('📊 Single event NGO details:', {
          hasNGODetails: !!(event.organizationId && typeof event.organizationId === 'object'),
          ngoName: event.organizationId?.name,
          ngoType: event.organizationId?.organizationType
        });
      }
    } catch (singleEventError) {
      console.log('⚠️ Single event endpoint not available or failed:', singleEventError.response?.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testEventDetailsWithNGO();