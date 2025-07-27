const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Full name is required."],
        minlength: [5, "Full name must be at least 5 characters."],
        maxlength: [50, "Full name must be less than 50 characters."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: [/.+\@.+\..+/, "Please enter a valid email address."],
        unique: true, // Make sure emails are unique
    },
    role: {
        type: String,
        enum: ["user", "coach", "admin"],
        default: "user",
        required: [true, "Role is required."]
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [6, "Password must be at least 6 characters."]
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
    },
    coachingRequest: {
        type: Boolean,
        default: false
    }
});

UserSchema.path('email').validate({
    isAsync: true,
    validator: async function (value) {
        if (this.isNew || this.isModified('email')) {
            const existingUser = await mongoose.models.User.findOne({ email: value });
            return !existingUser;
        }
        return true;
    },
    message: 'A user with this email already exists.'
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;