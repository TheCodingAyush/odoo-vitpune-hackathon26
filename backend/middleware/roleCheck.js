function isAdmin(req, res, next) {
    console.log("[roleCheck] isAdmin check. req.user:", req.user);
    const fs = require('fs');
    fs.writeFileSync('roleCheck_debug.json', JSON.stringify({ headers: req.headers, user: req.user }, null, 2));

    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({ message: "Access denied: Requires admin privileges", _debug: req.user });
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
