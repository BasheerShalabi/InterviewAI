const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: [true, "Job role is required."],
    minlength: [3, "Job role must be more than 3 chars."],
    maxlength: [50, "Job role cannot be greater than or equal to 50 chars."]
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
    type: String,
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
  }
})

const Session = mongoose.model('Session', SessionSchema)

module.exports = Session;