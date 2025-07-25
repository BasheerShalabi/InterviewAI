const axios = require('axios');
const MAX_TOKENS = 4096; // for deepseek-chat
const MAX_COMPLETION_TOKENS = 500; // leave room for AI reply
const { encode } = require('gpt-3-encoder');

function countTokens(messages) {
    return messages.reduce((total, msg) => {
        const role = msg.role || '';
        const content = msg.content || '';
        return total + encode(role).length + encode(content).length + 4;
    }, 0);
}


async function callAiModel(messages) {
    try {

        const promptTokens = countTokens(messages);

        if (promptTokens + MAX_COMPLETION_TOKENS > MAX_TOKENS) {
            throw new Error(`Prompt too long: ${promptTokens} tokens (max ${MAX_TOKENS - MAX_COMPLETION_TOKENS} allowed for prompt).`);
        }

        const response = await axios.post(process.env.API_URL, {
            model: process.env.MODEL,
            messages,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });

        const data = response.data;

        if (
            !data ||
            !Array.isArray(data.choices) ||
            data.choices.length === 0 ||
            !data.choices[0].message?.content
        ) {
            console.error("Unexpected DeepSeek response structure:", JSON.stringify(data, null, 2));
            throw new Error("AI model did not return a valid response.");
        }

        const reply = data.choices[0].message.content;
        console.log("AI Response:", reply);

        return reply;

    } catch (error) {
        if (error.response) {
            console.error("DeepSeek API error:", error.response.status, error.response.data);
        } else {
            console.error("Axios error:", error.message);
        }
        throw error;
    }
}

module.exports = callAiModel;
