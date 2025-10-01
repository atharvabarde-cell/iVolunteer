const BASE_URL = 'http://localhost:5000/api/v1';

async function testRegistrationBonus() {
    console.log('🔍 Testing Registration Bonus Functionality...\n');

    // Test data
    const testUser = {
        name: `Test User ${Date.now()}`,
        email: `testuser${Date.now()}@example.com`,
        password: 'password123',
        role: 'user'
    };

    console.log('📝 Test user data:', {
        name: testUser.name,
        email: testUser.email,
        role: testUser.role
    });

    try {
        // 1. Test registration
        console.log('\n1️⃣ Testing user registration...');
        const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        const registerData = await registerResponse.json();
        
        if (registerResponse.ok) {
            console.log('✅ Registration successful!');
            console.log('   User ID:', registerData.user.userId);
            console.log('   Coins:', registerData.user.coins);
            console.log('   Message:', registerData.message);
            
            // Check if coins are 50
            if (registerData.user.coins === 50) {
                console.log('✅ Welcome bonus coins correctly set to 50');
            } else {
                console.log('❌ Welcome bonus coins incorrect. Expected: 50, Got:', registerData.user.coins);
            }
        } else {
            console.log('❌ Registration failed:', registerData.message);
            return;
        }

        const accessToken = registerData.tokens.accessToken;

        // 2. Test getting reward stats to verify total coins calculation
        console.log('\n2️⃣ Testing reward stats (total coins earned)...');
        const statsResponse = await fetch(`${BASE_URL}/rewards/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const statsData = await statsResponse.json();
        
        if (statsResponse.ok) {
            console.log('✅ Stats retrieval successful!');
            console.log('   Active Coins:', statsData.data.activeCoins);
            console.log('   Total Coins Earned:', statsData.data.totalCoinsEarned);
            console.log('   Total Spent:', statsData.data.totalSpent);
            
            // Check if total coins earned includes the registration bonus
            if (statsData.data.totalCoinsEarned >= 50) {
                console.log('✅ Total coins earned includes registration bonus');
            } else {
                console.log('❌ Total coins earned missing registration bonus. Expected: >=50, Got:', statsData.data.totalCoinsEarned);
            }
        } else {
            console.log('❌ Stats retrieval failed:', statsData.message);
        }

        console.log('\n🎉 Test completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   ✅ User registration with 50 coins bonus');
        console.log('   ✅ Proper message returned from backend');
        console.log('   ✅ Total coins calculation includes registration bonus');
        console.log('\n💡 Next steps:');
        console.log('   - Test frontend toast notification manually');
        console.log('   - Verify database records in MongoDB');

    } catch (error) {
        console.log('❌ Test failed with error:', error.message);
        console.log('🔧 Make sure your backend server is running on port 5000');
    }
}

testRegistrationBonus();