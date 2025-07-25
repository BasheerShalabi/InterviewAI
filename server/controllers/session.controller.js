const Session = require('../models/session.model');
const User = require('../models/user.model')
const callAiModel = require('../utils/ai');
const parseAiFeedback = require('../utils/parser');
const { cleanQuestion } = require('../utils/responseCleaner')

module.exports.createSession = async (req, res) => {
    try {
        const { raw, numQuestions, type } = req.body;
        const userId = req.user.id;

        const fetchedUser = await User.findOne({ _id:userId })

        const userName = fetchedUser.fullname

        const newSession = await Session.create({
            userId,
            userName,
            raw,
            type,
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
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ error: "Session not found" });

        if (session.userId.toString() === req.user.id) {
            return res.json(session);
        }

        const sessionOwner = await User.findById(session.userId);
        if (sessionOwner && sessionOwner.assignedCoachId?.toString() === req.user.id) {
            return res.json(session);
        }

        return res.status(403).json({ error: "Access denied" });
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

        const prompt = `
            You are acting as a professional interviewer. You will behave like a real person conducting a job interview — asking one question at a time based on the user's CV and responses. Do NOT ask all the questions at once. Begin by greeting the candidate and asking the first question only. Then wait for their response before continuing. Each new message should contain only the next appropriate question and nothing more.


            Below is the candidate’s raw CV text, extracted from a PDF:
            <CV>
            ${session.raw}
            </CV>

            Conduct a ${session.type} interview . Ask the candidate ${session.numQuestions} thoughtful and relevant interview questions one at a time.
                        
            `

        if (session.messages.length === 0 && content.trim() === 'start' && !session.inProgress) {

            const aiStart = [
                { role: 'system', content: prompt },
                { role: 'user', content: 'lets start' },
            ];

            const aiResponse = await callAiModel(aiStart);

            const cleaned = cleanQuestion(aiResponse)

            session.messages.push({ role: 'assistant', content: cleaned });
            session.inProgress = true;

            await session.save();

            return res.json({ done: false, content: cleaned });
        }

        session.messages.push({ role: 'user', content });

        const assistantMessagesCount = session.messages.filter(m => m.role === 'assistant').length;

        if (assistantMessagesCount < session.numQuestions) {

            const aiInputMessages = [
                { role: 'system', content: prompt },
                ...session.messages,
            ];

            const aiResponse = await callAiModel(aiInputMessages);

            const cleaned = cleanQuestion(aiResponse)

            session.messages.push({ role: 'assistant', content: cleaned });
            await session.save();

            return res.json({ done: false, content: cleaned });
        } else {

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
                { role: 'user', content: 'That was my last answer. Please provide detailed feedback, a summary, and a score from 1 to 10.' }
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
            session.inProgress = false;
            // session.messages.push({ role: 'assistant', content: aiFinalResponse });

            await session.save();

            return res.json({ done: true, feedback: parsed });
        }
    } catch (error) {
        console.error('Error in sendMessage:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports.updateCoachFeedback = async (req, res) => {
    try {
        const feedback = req.body
        const session = await Session.findByIdAndUpdate(req.params.id, { coachFeedback: feedback });
        if (!session) return res.status(404).json({ error: "Session not found" });

        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

