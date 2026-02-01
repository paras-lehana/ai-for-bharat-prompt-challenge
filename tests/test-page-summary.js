const axios = require('axios');
const fs = require('fs');

async function testPageSummary() {
    try {
        console.log('🧪 Testing /voice/page-summary endpoint...');
        const response = await axios.post('http://localhost:5000/api/voice/page-summary', {
            pageType: 'listing_detail',
            data: {
                cropType: 'Tomato',
                finalPrice: 25,
                unit: 'kg',
                quantity: '100 kg',
                locationAddress: 'Pune'
            },
            languageCode: 'en'
        });

        console.log('✅ Response received!');
        console.log('Text Summary:', response.data.text);
        
        if (response.data.audio) {
            console.log('✅ Audio data present (length:', response.data.audio.length, ')');
            // Save to file for verification if needed
            // fs.writeFileSync('test_summary.wav', Buffer.from(response.data.audio, 'base64'));
        } else {
            console.log('❌ No audio data in response');
        }
    } catch (e) {
        console.error('❌ Test failed:', e.response ? e.response.status + ' - ' + JSON.stringify(e.response.data) : e.message);
    }
}

testPageSummary();
