const Session = require('../models/session.model');
const callAiModel = require('../utils/ai');
const parseAiFeedback = require('../utils/parser');

module.exports.createSession = async (req, res) => {
    try {
        const { jobRole, numQuestions } = req.body;
        const userId = req.user.id;

        const newSession = await Session.create({
            userId,
            jobRole,
            messages: [],
            feedback: [],
            numQuestions
        });

        res.status(201).json(newSession);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
        if (!session) return res.status(404).json({ error: "Session not found" });

        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.sendMessage = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ error: 'Message content is required' });
        }

        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        if (session.isComplete) return res.status(400).json({ error: 'Session already completed' });

        session.messages.push({ role: 'user', content });

        const assistantMessagesCount = session.messages.filter(m => m.role === 'assistant').length;

        if (assistantMessagesCount < session.numQuestions) {

            const aiInputMessages = [
                { role: 'system', content: `You are a helpful interview coach for the job role: ${session.jobRole}. Ask questions to assess the candidate.` },
                ...session.messages,
            ];

            const aiResponse = await callAiModel(aiInputMessages);

            session.messages.push({ role: 'assistant', content: aiResponse });
            await session.save();

            return res.json({ done: false, aiMessage: aiResponse });
        } else {

            session.messages.push({ role: 'user', content: 'That was my last answer. Please provide detailed feedback, a summary, and a score from 1 to 10.' });

            const aiInputMessages = [
                {
                    role: 'system', content: `You are an AI giving structured interview feedback. Respond with JSON only using this format: 
                            {
                            "feedback": [
                                { "questionNumber": 1, "content": "Your answer lacked specifics." },
                                ...
                            ],
                            "overallScore": 7,
                            "finalReview": {
                                "summary": "Good effort overall.",
                                "strengths": ["Clear answers", "Confident tone"],
                                "weaknesses": ["Lack of examples", "Sometimes vague"],
                                "scores": {
                                "clarity": "8/10",
                                "confidence": "7/10",
                                "relevance": "6/10"
                                },
                                "suggestions": "Be more specific and back up answers with real examples."
                            }
                            }` }, 
                ...session.messages,
            ];

            const aiFinalResponse = await callAiModel(aiInputMessages);

            const parsed = parseAiFeedback(aiFinalResponse);
            if (!parsed) {
                return res.status(500).json({ error: 'Failed to parse AI feedback' });
            }

            session.feedback = parsed.feedback;
            session.overallScore = parsed.overallScore;
            session.finalReview = parsed.finalReview;
            session.isComplete = true;
            session.messages.push({ role: 'assistant', content: aiFinalResponse });

            await session.save();

            return res.json({ done: true, feedback: parsed });
        }
    } catch (error) {
        console.error('Error in sendMessage:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
