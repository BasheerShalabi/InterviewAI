const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    // console.log("Auth Header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    try {
        console.log("Verifying token...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role , assignedCoachId:decoded.assignedCoachId };
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}

function requireRole(allowedRoles) {
    return (req, res, next) => {
        try {
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ error: "Access denied: Insufficient role" });
            }
            next();
        } catch (err) {
            res.status(403).json({ error: "Invalid or expired token" });
        }
    };
}

module.exports = { verifyToken, requireRole };
