const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');

const analyzeCV = async (filePath) => {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    const text = data.text;

    const prompt = `
        You are a senior HR analyst and technical recruiter. Given a detailed candidate CV, analyze it as if you were preparing an internal assessment report for a hiring manager.

            Return a structured JSON object with the following keys:
            - "score" (Overall score for the CV out of 100, based on relevance to the position)
            - "skills" (array of up to 15 most relevant technical skills extracted from the CV)
            - "experience" (expected experience level in years e.g., "5+ years , mid-level")
            - "strengths" (array of up to 5 bullet points highlighting strong areas)
            - "recommendations" (array of up to 5 specific interview suggestions or focus points based on the candidate's profile)

            Make the analysis detailed but realistic — avoid generic boilerplate, and make the strengths and recommendations tailored to the actual content of the CV.

            Only return the JSON object — no explanation or extra output.

        CV Raw Content:
        """${text}"""
`;

    const response = await axios.post(process.env.API_URL, {
        model: process.env.MODEL,
        messages: [{ role: 'system', content: prompt }]
    }, {
        headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    return {result : response.data.choices[0].message.content , raw: text};
};

module.exports = analyzeCV;
