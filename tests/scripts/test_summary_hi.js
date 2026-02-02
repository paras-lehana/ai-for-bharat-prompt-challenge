require('dotenv').config({ path: './backend/.env' });
const axios = require('axios');

async function testSummary() {
    const languageCode = 'hi';
    const pageType = 'analytics';
    const data = { totalSales: 45250, activeListings: 8, pendingNegotiations: 3, trustScore: 4.8 };
    
    // Exact logic from AIService.js
    const pagePrompts = {
        'analytics': `These are market trends for your crops. 
          Total Sales: ${data.totalSales}. 
          Active Listings: ${data.activeListings}.
          Focus: Inform the farmer about the market sentiment and whether it's a good time to sell.`
    };
    const contextPrompt = pagePrompts[pageType];

    const systemPrompt = `You are 'Kisaan Bhai', a friendly agricultural assistant. 
        Your task is to summarize page content for a farmer in simplified ${languageCode} script (for TTS).
        
        CRITICAL RULES:
        1. Output ONLY in the script of ${languageCode} (e.g. use Devanagari for 'hi', Telugu script for 'te').
        2. NO ENGLISH CHARACTERS allowed except for numbers or units (e.g., ₹, Kg).
        3. Start with a warm, friendly greeting in ${languageCode}.
        4. Use very simple language, avoiding technical jargon.
        5. Mention 2-3 key details from the context provided.
        6. Suggest ONE clear, actionable next step.
        7. PLAIN TEXT ONLY. No markdown, bold, or symbols.
        8. Keep the total length under 60 words.`;

    console.log('🧪 Calling OpenRouter with NEW system prompt and user context...');
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: process.env.OPENROUTER_MODEL || "google/gemma-3-27b-it:free",
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Here is the current page context to summarize in ${languageCode}:\n${contextPrompt}` }
                ],
                temperature: 0.6,
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('✅ Response from AI:');
        console.log(response.data.choices[0].message.content);
    } catch (e) {
        console.error('❌ Error:', e.response?.data || e.message);
    }
}

testSummary();
