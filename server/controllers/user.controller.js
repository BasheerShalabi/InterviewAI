const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.registerUser = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        const newUser = new User({ fullname, email, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
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

        const token = jwt.sign({ id: user._id, role: user.role , fullname: user.fullname }, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
