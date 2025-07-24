const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.registerUser = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        const newUser = new User({ fullname, email, password, role });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id, role: newUser.role, fullname: newUser.fullname , requestId:newUser.pendingCoachRequest ,coachId: newUser.assignedCoachId   }, JWT_SECRET, {
            expiresIn: '1d'

        });

        res.status(201).json({ message: "User registered successfully", token: token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

        const token = jwt.sign({ id: user._id, role: user.role, fullname: user.fullname , requestId:user.pendingCoachRequest ,coachId: user.assignedCoachId }, JWT_SECRET, {
            expiresIn: '1d'
        });

        res.json({ token: token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
