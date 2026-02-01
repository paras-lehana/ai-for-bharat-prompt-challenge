const axios = require('axios');

const models = [
    "google/gemma-2-9b-it:free",
    "google/gemma-7b-it:free",
    "meta-llama/llama-3-8b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "microsoft/phi-3-mini-128k-instruct:free",
    "google/gemma-3-27b-it:free"
];

const apiKey = "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";

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
