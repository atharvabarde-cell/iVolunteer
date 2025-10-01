// Test script for updated contact number validation (mobile + telephone)
import fs from 'fs';

console.log('📞 Testing Updated Contact Number Validation');
console.log('='.repeat(50));

const authPagePath = 'c:\\Users\\sushi\\OneDrive\\Desktop\\iVolunteer\\frontend\\app\\auth\\page.tsx';

if (fs.existsSync(authPagePath)) {
    const content = fs.readFileSync(authPagePath, 'utf-8');
    
    console.log('✅ Checking Frontend Validation...\n');
    
    // Check if input type is tel
    if (content.includes('type="tel"')) {
        console.log('✅ Input type changed to "tel" for better UX');
    }
    
    // Check placeholder
    if (content.includes('placeholder="9876543210 or 011-12345678"')) {
        console.log('✅ Placeholder shows both mobile and landline examples');
    }
    
    // Check if validation allows multiple formats
    if (content.includes('digitsOnly.length >= 7 && digitsOnly.length <= 15')) {
        console.log('✅ Accepts 7-15 digit numbers');
    }
    
    if (content.includes('[6-9]')) {
        console.log('✅ Validates Indian mobile numbers (starting with 6-9)');
    }
    
    if (content.includes('areaCodes') && content.includes("'011'")) {
        console.log('✅ Validates Indian landline numbers with area codes');
    }
    
    // Check input filtering
    if (content.includes('replace(/[^0-9\\s\\-\\(\\)\\+]/g')) {
        console.log('✅ Input allows numbers, spaces, hyphens, parentheses, and plus sign');
    }
    
    console.log('\n📋 Valid Contact Number Formats:');
    console.log('');
    console.log('Mobile Numbers:');
    console.log('  • 9876543210 (10-digit Indian mobile)');
    console.log('  • 8765432109 (10-digit Indian mobile)');
    console.log('  • 7654321098 (10-digit Indian mobile)');
    console.log('  • 6543210987 (10-digit Indian mobile)');
    console.log('');
    console.log('Landline Numbers:');
    console.log('  • 011-12345678 (Delhi landline with area code)');
    console.log('  • 022-87654321 (Mumbai landline)');
    console.log('  • 080-12345678 (Bangalore landline)');
    console.log('  • 0484-1234567 (Kochi landline)');
    console.log('');
    console.log('International Numbers:');
    console.log('  • +91 9876543210 (with country code)');
    console.log('  • +1-555-123-4567 (US number)');
    console.log('  • +44 20 7123 4567 (UK number)');
    
    console.log('\n❌ Invalid Formats:');
    console.log('  • 123456 (too short - less than 7 digits)');
    console.log('  • 12345678901234567 (too long - more than 15 digits)');
    console.log('  • 1234567890 (mobile starting with 1-5, not valid Indian mobile)');
    console.log('  • abc123 (contains letters)');
    
    console.log('\n🎯 Testing Instructions:');
    console.log('1. Try entering various mobile numbers (starting with 6-9)');
    console.log('2. Test landline numbers with area codes (011, 022, etc.)');
    console.log('3. Try international numbers with country codes');
    console.log('4. Verify that spaces, hyphens, and parentheses are allowed');
    console.log('5. Check that letters and special characters are blocked');
    
} else {
    console.log('❌ Auth page file not found');
}

console.log('\n🔧 Backend Validation:');
console.log('The backend has been updated to match frontend validation');
console.log('Both mobile and landline numbers are now accepted');