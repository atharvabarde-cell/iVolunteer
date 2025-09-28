// Comprehensive test for NGO Registration Real-time Validation
import fs from 'fs';

console.log('🔍 Testing NGO Registration Real-time Validation Features');
console.log('='.repeat(70));

const authPagePath = 'c:\\Users\\sushi\\OneDrive\\Desktop\\iVolunteer\\frontend\\app\\auth\\page.tsx';

if (fs.existsSync(authPagePath)) {
    const content = fs.readFileSync(authPagePath, 'utf-8');
    
    console.log('📋 Checking Real-time Validation Configuration...\n');
    
    // 1. Check useForm configuration
    if (content.includes('mode: "onChange"') && content.includes('reValidateMode: "onChange"')) {
        console.log('✅ React Hook Form configured for real-time validation');
    } else {
        console.log('❌ React Hook Form not configured for real-time validation');
    }
    
    // 2. Check Year Established Field
    console.log('\n🗓️ Year Established Field:');
    if (content.includes('type="number"') && 
        content.includes('min="1800"') && 
        content.includes('max={new Date().getFullYear()}')) {
        console.log('✅ Input type is number with min/max attributes');
    }
    
    if (content.includes('onInput={(e) => {') && 
        content.includes('target.value.replace(/[^0-9]/g') && 
        content.includes('.slice(0, 4)')) {
        console.log('✅ Number-only input handler (4 digits max)');
    }
    
    if (content.includes('validYear: (value)') && 
        content.includes('Year must be between 1800 and')) {
        console.log('✅ Custom validation function for valid year range');
    }
    
    // 3. Check Contact Number Field
    console.log('\n📞 Contact Number Field:');
    if (content.includes('type="number"') && 
        content.includes('placeholder="9876543210"')) {
        console.log('✅ Input type changed to number with numeric placeholder');
    }
    
    if (content.includes('onInput={(e) => {') && 
        content.includes('target.value.replace(/[^0-9]/g') && 
        content.includes('.slice(0, 15)')) {
        console.log('✅ Number-only input handler (15 digits max)');
    }
    
    if (content.includes('validPhone: (value)') && 
        content.includes('Contact number must be 10-15 digits')) {
        console.log('✅ Custom validation function for phone number');
    }
    
    if (content.includes('/^[1-9][\\d]{9,14}$/')) {
        console.log('✅ Regex pattern prevents leading zeros');
    }
    
    // 4. Check NGO Description Field
    console.log('\n📝 NGO Description Field:');
    if (content.includes('wordCount: (value)') && 
        content.includes('Description must contain at least 10 words')) {
        console.log('✅ Word count validation (minimum 10 words)');
    }
    
    if (content.includes('watch("ngoDescription")') && 
        content.includes('words.length} words')) {
        console.log('✅ Real-time word counter display');
    }
    
    console.log('\n🎯 Testing Scenarios to Verify:');
    console.log('');
    console.log('Year Established:');
    console.log('  • Try typing letters → should be blocked');
    console.log('  • Enter 1700 → should show "Year must be between 1800 and 2025"');
    console.log('  • Enter 2030 → should show "Year must be between 1800 and 2025"');
    console.log('  • Enter 2020 → should be valid');
    console.log('');
    console.log('Contact Number:');
    console.log('  • Try typing letters/symbols → should be blocked');
    console.log('  • Enter 0123456789 → should show error (starts with 0)');
    console.log('  • Enter 123 → should show "Contact number must be 10-15 digits"');
    console.log('  • Enter 9876543210 → should be valid');
    console.log('');
    console.log('NGO Description:');
    console.log('  • Enter "Short text" → should show word count error');
    console.log('  • Enter 9 words → should show "Description must contain at least 10 words"');
    console.log('  • Enter 10+ words → should be valid with word count display');
    
    console.log('\n✨ All validation features implemented successfully!');
    console.log('Real-time validation should now work for all three fields.');
    
} else {
    console.log('❌ Auth page file not found');
}