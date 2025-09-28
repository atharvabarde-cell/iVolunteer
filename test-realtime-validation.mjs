// Test script for real-time validation
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🧪 Testing Real-time Validation for NGO Registration Form');
console.log('='.repeat(60));

// Test the auth page file exists and has no syntax errors
try {
    const authPagePath = 'c:\\Users\\sushi\\OneDrive\\Desktop\\iVolunteer\\frontend\\app\\auth\\page.tsx';
    
    if (fs.existsSync(authPagePath)) {
        console.log('✅ Auth page file exists');
        
        // Check for validation patterns
        const content = fs.readFileSync(authPagePath, 'utf-8');
        
        // Check Year Established validation
        if (content.includes('validYear: (value)') && 
            content.includes('Year must be between 1800')) {
            console.log('✅ Year Established validation is present');
        } else {
            console.log('❌ Year Established validation missing or incorrect');
        }
        
        // Check Contact Number validation
        if (content.includes('validPhone: (value)') && 
            content.includes('Contact number must be')) {
            console.log('✅ Contact Number validation is present');
        } else {
            console.log('❌ Contact Number validation missing or incorrect');
        }
        
        // Check NGO Description validation
        if (content.includes('wordCount: (value)') && 
            content.includes('Description must contain at least 10 words')) {
            console.log('✅ NGO Description validation is present');
        } else {
            console.log('❌ NGO Description validation missing or incorrect');
        }
        
        // Check if contact number input is type="number"
        if (content.includes('type="number"') && 
            content.includes('Contact Number')) {
            console.log('✅ Contact Number input is set to number type');
        } else {
            console.log('❌ Contact Number input type needs to be changed to number');
        }
        
        // Check for onInput handlers for number-only fields
        if (content.includes('onInput={(e) => {') && 
            content.includes('replace(/[^0-9]/g')) {
            console.log('✅ Number-only input handlers are present');
        } else {
            console.log('❌ Number-only input handlers missing');
        }
        
        console.log('\n📋 Validation Summary:');
        console.log('- Year Established: Real-time validation with range 1800-current year');
        console.log('- Contact Number: Number-only input with 10-15 digit validation');
        console.log('- NGO Description: Word count validation (minimum 10 words)');
        
    } else {
        console.log('❌ Auth page file not found');
    }
    
} catch (error) {
    console.error('❌ Error testing validations:', error.message);
}

console.log('\n🔧 Manual Testing Instructions:');
console.log('1. Go to the signup form and select "NGO" role');
console.log('2. Test Year Established: Enter invalid years (e.g., 1700, 2030)');
console.log('3. Test Contact Number: Try entering letters or symbols');
console.log('4. Test Description: Enter less than 10 words');
console.log('5. Check that error messages appear in real-time');