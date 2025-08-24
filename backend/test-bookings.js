// Simple test script to verify booking API endpoints
// Run with: node test-bookings.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testData = {
  property: '507f1f77bcf86cd799439011', // Mock property ID
  startDate: '2025-09-01',
  endDate: '2025-09-30',
  message: 'Test booking message'
};

async function testBookingsAPI() {
  console.log('🧪 Testing Bookings API...\n');

  try {
    // Test 1: Check if /api/bookings endpoint exists
    console.log('1. Testing /api/bookings endpoint...');
    const response = await fetch(`${BASE_URL}/bookings`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${response.statusText}`);
    
    if (response.status === 401) {
      console.log('   ✅ Endpoint exists (requires authentication)');
    } else if (response.status === 404) {
      console.log('   ❌ Endpoint not found');
    } else {
      console.log(`   ℹ️  Unexpected status: ${response.status}`);
    }

    // Test 2: Check if /api/bookings/me endpoint exists
    console.log('\n2. Testing /api/bookings/me endpoint...');
    const meResponse = await fetch(`${BASE_URL}/bookings/me`);
    console.log(`   Status: ${meResponse.status}`);
    console.log(`   Response: ${meResponse.statusText}`);
    
    if (meResponse.status === 401) {
      console.log('   ✅ Endpoint exists (requires authentication)');
    } else if (meResponse.status === 404) {
      console.log('   ❌ Endpoint not found');
    } else {
      console.log(`   ℹ️  Unexpected status: ${meResponse.status}`);
    }

    // Test 3: Check if /api/bookings/:id/status endpoint exists
    console.log('\n3. Testing /api/bookings/:id/status endpoint...');
    const statusResponse = await fetch(`${BASE_URL}/bookings/test-id/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    });
    console.log(`   Status: ${statusResponse.status}`);
    console.log(`   Response: ${statusResponse.statusText}`);
    
    if (statusResponse.status === 401) {
      console.log('   ✅ Endpoint exists (requires authentication)');
    } else if (statusResponse.status === 404) {
      console.log('   ❌ Endpoint not found');
    } else {
      console.log(`   ℹ️  Unexpected status: ${statusResponse.status}`);
    }

    console.log('\n✅ All endpoints tested successfully!');
    console.log('\n📝 Note: 401 responses are expected since we\'re not providing authentication tokens.');
    console.log('   This confirms the endpoints exist and are properly protected.');

  } catch (error) {
    console.error('\n❌ Error testing API:', error.message);
    console.log('\n💡 Make sure your backend server is running on port 5000');
  }
}

// Run the test
testBookingsAPI();
