import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

// Test the daily rewards tracking
async function testDailyRewards() {
  try {
    console.log('🧪 Testing Daily Rewards Tracking...\n');

    // Login to get auth token
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com', // Replace with actual test user
      password: 'password123'    // Replace with actual password
    });

    const token = loginResponse.data?.token;
    if (!token) {
      console.log('❌ Login failed - no token received');
      return;
    }

    console.log('✅ Login successful');

    // Get debug info about reward records
    console.log('🔍 Checking existing reward records...');
    const debugResponse = await axios.get(`${BASE_URL}/rewards/debug`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📊 Current reward records:', {
      dailyRewards: debugResponse.data.data.dailyRewards.length,
      registrationRewards: debugResponse.data.data.registrationRewards.length,
      participationRewards: debugResponse.data.data.participationRewards.length
    });

    // Get current user stats before claiming daily reward
    const statsBefore = await axios.get(`${BASE_URL}/rewards/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📊 Stats before daily reward:', {
      activeCoins: statsBefore.data.data.activeCoins,
      totalCoinsEarned: statsBefore.data.data.totalCoinsEarned,
      dailyRewardClaimed: statsBefore.data.data.todaysClaimed?.daily_quote
    });

    // Check if daily reward already claimed
    if (statsBefore.data.data.todaysClaimed?.daily_quote) {
      console.log('⚠️ Daily reward already claimed today');
      return;
    }

    // Claim daily reward
    console.log('🎯 Claiming daily reward...');
    
    const claimResponse = await axios.post(
      `${BASE_URL}/rewards/daily-claim`,
      { type: 'daily_quote' },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('✅ Daily reward claimed:', {
      message: claimResponse.data.message,
      coins: claimResponse.data.coins,
      type: claimResponse.data.type
    });

    // Wait a moment for the database to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get debug info after claiming
    console.log('🔍 Checking reward records after claiming...');
    const debugAfterResponse = await axios.get(`${BASE_URL}/rewards/debug`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📊 Reward records after claiming:', {
      dailyRewards: debugAfterResponse.data.data.dailyRewards.length,
      registrationRewards: debugAfterResponse.data.data.registrationRewards.length,
      participationRewards: debugAfterResponse.data.data.participationRewards.length
    });

    // Get user stats after claiming daily reward
    const statsAfter = await axios.get(`${BASE_URL}/rewards/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📊 Stats after daily reward:', {
      activeCoins: statsAfter.data.data.activeCoins,
      totalCoinsEarned: statsAfter.data.data.totalCoinsEarned,
      dailyRewardClaimed: statsAfter.data.data.todaysClaimed?.daily_quote
    });

    // Check the differences
    const activeCoinsIncrease = statsAfter.data.data.activeCoins - statsBefore.data.data.activeCoins;
    const totalCoinsIncrease = statsAfter.data.data.totalCoinsEarned - statsBefore.data.data.totalCoinsEarned;

    console.log('📈 Changes:', {
      activeCoinsIncrease,
      totalCoinsIncrease
    });

    if (activeCoinsIncrease > 0 && totalCoinsIncrease > 0) {
      console.log('✅ SUCCESS: Both activeCoins and totalCoinsEarned increased!');
    } else if (activeCoinsIncrease > 0 && totalCoinsIncrease === 0) {
      console.log('❌ PROBLEM IDENTIFIED: activeCoins increased but totalCoinsEarned did not!');
      console.log('🔍 This means daily rewards are not being included in totalCoinsEarned calculation');
    } else {
      console.log('❌ FAILED: Daily reward not working properly');
    }

  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already claimed')) {
      console.log('⚠️ Daily reward already claimed today');
    } else {
      console.error('❌ Test failed:', error.response?.data || error.message);
    }
  }
}

// Run the test
testDailyRewards();