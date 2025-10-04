/**
 * Test script to verify group membership data is being returned correctly
 * Run this after logging in and joining a group
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Replace this with your actual JWT token from localStorage
const TOKEN = 'YOUR_JWT_TOKEN_HERE';

async function testGetGroups() {
    console.log('\n=== Testing GET /api/v1/groups ===');
    
    try {
        const response = await fetch(`${API_BASE_URL}/v1/groups`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
            },
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Successfully fetched groups');
            console.log(`Total groups: ${data.data.length}`);
            
            data.data.forEach((group, index) => {
                console.log(`\nGroup ${index + 1}:`);
                console.log(`  Name: ${group.name}`);
                console.log(`  ID: ${group._id}`);
                console.log(`  Member Count: ${group.memberCount}`);
                console.log(`  isMember: ${group.isMember}`);
                console.log(`  userRole: ${group.userRole}`);
                console.log(`  Creator: ${group.creator.name}`);
            });
        } else {
            console.log('❌ Failed to fetch groups:', data.message);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testGetUserGroups() {
    console.log('\n=== Testing GET /api/v1/groups/user/my-groups ===');
    
    try {
        const response = await fetch(`${API_BASE_URL}/v1/groups/user/my-groups?type=all`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
            },
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Successfully fetched user groups');
            console.log(`Total user groups: ${data.data.length}`);
            
            data.data.forEach((group, index) => {
                console.log(`\nGroup ${index + 1}:`);
                console.log(`  Name: ${group.name}`);
                console.log(`  ID: ${group._id}`);
                console.log(`  Member Count: ${group.memberCount}`);
                console.log(`  isMember: ${group.isMember}`);
                console.log(`  userRole: ${group.userRole}`);
                console.log(`  Creator: ${group.creator.name}`);
            });
        } else {
            console.log('❌ Failed to fetch user groups:', data.message);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testJoinGroup(groupId) {
    console.log(`\n=== Testing POST /api/v1/groups/${groupId}/join ===`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/v1/groups/${groupId}/join`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
            },
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Successfully joined group');
            console.log('Group data:', {
                name: data.data.name,
                memberCount: data.data.memberCount,
                isMember: data.data.isMember,
                userRole: data.data.userRole
            });
        } else {
            console.log('❌ Failed to join group:', data.message);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Instructions
console.log('================================================');
console.log('Group Membership Test Script');
console.log('================================================');
console.log('\nINSTRUCTIONS:');
console.log('1. Open your browser and log in to the application');
console.log('2. Open DevTools (F12) and go to Console');
console.log('3. Type: localStorage.getItem("auth-token")');
console.log('4. Copy the token value (without quotes)');
console.log('5. Replace YOUR_JWT_TOKEN_HERE in this file');
console.log('6. Run: node test-group-membership.mjs');
console.log('================================================\n');

if (TOKEN === 'YOUR_JWT_TOKEN_HERE') {
    console.log('⚠️  Please set your JWT token first!');
    console.log('Follow the instructions above to get your token.\n');
} else {
    // Run tests
    (async () => {
        await testGetGroups();
        await testGetUserGroups();
        
        // Uncomment and add a group ID to test joining
        // await testJoinGroup('GROUP_ID_HERE');
    })();
}
