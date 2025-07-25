const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  raw: {
    type: String,
    required: true,
  },
  type:{
    type: String,
    enum: ['behavioural', 'technical' , 'hybrid'],
    required: true
  },
  messages: [
    {
      role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  feedback: [
    {
      questionNumber: {
        type: Number,
        required: true
      },
      content: {
        type: String,
        required: true
      }
    }
  ],
  overallScore: {
    type: Number,
    default: 0
  },
  finalReview: {
    summary : String,
    strengths: [String],
    weaknesses: [String],
    scores: {
      clarity: String,
      confidence: String,
      relevance: String
    },
    suggestions: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  coachFeedback: {
    type: Object,
    default: ""
  },
  numQuestions: {
    type: Number,
    required: true,
    min: [1, 'Must request at least 1 question'],
    max: [10, 'Cannot exceed 10 questions']
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  inProgress: {
    type: Boolean,
    default: false
  },
})

const Session = mongoose.model('Session', SessionSchema)

module.exports = Session;