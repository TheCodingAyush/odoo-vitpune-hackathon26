function isAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({ message: "Access denied: Requires admin privileges" });
}

function isManager(req, res, next) {
    if (req.user && req.user.role === "manager") {
        return next();
    }
    return res.status(403).json({ message: "Access denied: Requires manager privileges" });
}

function isEmployee(req, res, next) {
    if (req.user && req.user.role === "employee") {
        return next();
    }
    return res.status(403).json({ message: "Access denied: Requires employee privileges" });
}

module.exports = {
    isAdmin,
    isManager,
    isEmployee,
};
