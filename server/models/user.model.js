const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Name is required."],
        minlength: [5, "Name must be more than 5 chars."],
        maxlength: [50, "Title cannot be greater than or equal 50 chars."],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        validate: validateEmail
    },
    role: {
        type: String,
        required: [true, "Role is required."],
        enum: ["user", "coach", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    assignedCoachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    pendingCoachRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }

})

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

async function validateEmail(email) {
    const user = await this.constructor.findOne({ email })
    if (user) throw new Error("A user is already registered with this email address.")
}

const User = mongoose.model('User', UserSchema)

module.exports = User;