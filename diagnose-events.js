// Database diagnostic script to check event organizationId values
// This script helps debug the organizationId mismatch issue

import mongoose from 'mongoose';
import { Event } from './backend/src/models/Event.js';
import { User } from './backend/src/models/User.js';

async function diagnoseEventOrganizationIds() {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ivolunteer');
    
    console.log('Connected to MongoDB');
    
    // Get all events
    const events = await Event.find({}).select('title organizationId organization');
    console.log(`\nFound ${events.length} total events in database`);
    
    // Get all NGO users
    const ngoUsers = await User.find({ role: 'ngo' }).select('_id name email');
    console.log(`\nFound ${ngoUsers.length} NGO users:`);
    ngoUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}): ${user._id}`);
    });
    
    console.log('\nEvent analysis:');
    for (const event of events) {
      console.log(`\nEvent: "${event.title}"`);
      console.log(`  organizationId: ${event.organizationId}`);
      console.log(`  organization: ${event.organization}`);
      
      // Check if organizationId matches any NGO user
      const matchingUser = ngoUsers.find(user => user._id.toString() === event.organizationId.toString());
      if (matchingUser) {
        console.log(`  ✅ Matches NGO user: ${matchingUser.name}`);
      } else {
        console.log(`  ❌ No matching NGO user found!`);
      }
    }
    
    // Check for specific organization ID from the error
    const problemOrgId = '68de63c7cf20d1514c775788';
    console.log(`\n\nChecking for specific organization ID: ${problemOrgId}`);
    const eventsForOrg = await Event.find({ organizationId: problemOrgId });
    console.log(`Events found for ${problemOrgId}: ${eventsForOrg.length}`);
    
    const userWithProblemId = await User.findById(problemOrgId);
    if (userWithProblemId) {
      console.log(`User with ID ${problemOrgId}: ${userWithProblemId.name} (${userWithProblemId.role})`);
    } else {
      console.log(`No user found with ID ${problemOrgId}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the diagnostic
// diagnoseEventOrganizationIds();

console.log('To run this diagnostic:');
console.log('1. Set your MONGODB_URI environment variable');
console.log('2. Uncomment the diagnoseEventOrganizationIds() call');
console.log('3. Run: node diagnose-events.js');