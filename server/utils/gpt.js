const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getGPTAnalysis(entryText, systemPrompt) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", 
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": entryText }
        ],
    });

    return response.choices[0].message.content;
}

module.exports = { getGPTAnalysis };