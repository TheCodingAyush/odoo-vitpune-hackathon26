const bcrypt = require("bcrypt");
const { createUser: createDbUser, findAllByCompany, updateRole: updateDbRole, updateManager: updateDbManager, findById } = require("../models/User");

// POST /api/users/create
async function createUser(req, res) {
    const { name, email, password, role, managerId } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "name, email, password, and role are required" });
    }

    if (role !== "employee" && role !== "manager") {
        return res.status(400).json({ message: "Role must be employee or manager" });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await createDbUser(null, {
            companyId: req.user.companyId, // from auth payload
            name,
            email,
            passwordHash,
            role,
            managerId,
        });

        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: "Email already exists" });
        }
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Could not create user" });
    }
}

// GET /api/users
async function getAllUsers(req, res) {
    try {
        const users = await findAllByCompany(req.user.companyId);
        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Could not fetch users" });
    }
}

// PATCH /api/users/:id/role
async function updateRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["employee", "manager", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
    }

    try {
        const targetUser = await findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (targetUser.company_id !== req.user.companyId) {
            return res.status(403).json({ message: "Cannot edit user of another company" });
        }

        const updatedUser = await updateDbRole(id, role);
        return res.status(200).json({ message: "Role updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating role:", error);
        return res.status(500).json({ message: "Could not update role" });
    }
}

// PATCH /api/users/:id/manager
async function assignManager(req, res) {
    const { id } = req.params;
    const { managerId } = req.body;

    if (!managerId) {
        return res.status(400).json({ message: "managerId is required" });
    }

    try {
        const targetUser = await findById(id);
        const managerUser = await findById(managerId);

        if (!targetUser || !managerUser) {
            return res.status(404).json({ message: "User or Manager not found" });
        }

        if (targetUser.company_id !== req.user.companyId || managerUser.company_id !== req.user.companyId) {
            return res.status(403).json({ message: "Cannot assign across companies" });
        }

        if (managerUser.role === "employee") {
            return res.status(400).json({ message: "Selected manager does not have manager privileges" });
        }

        const updatedUser = await updateDbManager(id, managerId);
        return res.status(200).json({ message: "Manager assigned successfully", user: updatedUser });
    } catch (error) {
        console.error("Error assigning manager:", error);
        return res.status(500).json({ message: "Could not assign manager" });
    }
}

module.exports = {
    createUser,
    getAllUsers,
    updateRole,
    assignManager,
};
