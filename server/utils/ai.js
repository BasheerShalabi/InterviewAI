const axios = require('axios');

async function callAiModel(messages) {
    try {
        const response = await axios.post(process.env.API_URL, {
            model: process.env.MODEL,
            messages,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling AI model:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = callAiModel;
