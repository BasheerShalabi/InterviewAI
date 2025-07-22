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

module.exports = requireRole;
