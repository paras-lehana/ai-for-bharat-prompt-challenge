/**
 * Direct test of AIService processVoiceQuery method
 */

require('dotenv').config({ path: './backend/.env' });
const AIService = require('./backend/src/services/AIService');

async function test() {
  console.log('🧪 Testing AIService.processVoiceQuery directly\n');
  
  const testQueries = [
    'मुझे 100 किलो गेहूं बेचना है',
    'What is the price of tomatoes?',
    'I want to buy 50 kg rice from Delhi'
  ];
  
  for (const query of testQueries) {
    console.log('\n' + '='.repeat(60));
    console.log(`📝 Query: "${query}"`);
    console.log('─'.repeat(60));
    
    try {
      const result = await AIService.processVoiceQuery(query, 'hi');
      console.log('✅ Result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test complete');
}

test().catch(console.error);
