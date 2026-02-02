const axios = require('axios');
require('dotenv').config(); // Load environment variables

const models = [
    "google/gemma-2-9b-it:free",
    "google/gemma-7b-it:free",
    "meta-llama/llama-3-8b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "microsoft/phi-3-mini-128k-instruct:free",
    "google/gemma-3-27b-it:free"
];

// ✅ CORRECT - Load API key from environment variables
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.error('❌ ERROR: OPENROUTER_API_KEY environment variable not set');
    console.error('Please set it in your .env file or export it:');
    console.error('  export OPENROUTER_API_KEY=your-key-here');
    process.exit(1);
}

async function checkModel(model) {
    try {
        console.log(`Testing ${model}...`);
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: model,
                messages: [{ role: "user", content: "hi" }]
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://test.com",
                    "X-Title": "Test"
                },
                timeout: 10000
            }
        );
        console.log(`✅ ${model} WORKS! Status: ${response.status}`);
        return true;
    } catch (e) {
        console.log(`❌ ${model} FAILED: ${e.response ? e.response.status : e.message}`);
        if(e.response && e.response.data) console.log(JSON.stringify(e.response.data));
        return false;
    }
}

async function run() {
    for (const model of models) {
        if (await checkModel(model)) break;
    }
}

run();
