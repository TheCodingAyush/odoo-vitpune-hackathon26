const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { create: createCompany } = require("../models/Company");
const { createUser, findByEmail } = require("../models/User");
const { generateToken } = require("../utils/token");

async function signup(req, res) {
    const { companyName, country, currency, name, email, password } = req.body;

    if (!companyName || !country || !currency || !name || !email || !password) {
        return res.status(400).json({
            message:
                "companyName, country, currency, name, email, and password are required",
        });
    }

    const existingUser = await findByEmail(email);
    if (existingUser) {
        return res.status(409).json({ message: "Email is already registered" });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const company = await createCompany(client, {
            name: companyName,
            country,
            currency,
        });

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await createUser(client, {
            companyId: company.id,
            name,
            email,
            passwordHash,
            role: "admin",
        });

        await client.query("COMMIT");

        const token = generateToken({
            userId: user.id,
            companyId: user.company_id,
            role: user.role,
        });

        return res.status(201).json({
            message: "Signup successful",
            token,
            user,
            company,
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Signup failed:", error);
        return res.status(500).json({ message: "Could not create account" });
    } finally {
        client.release();
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
    }

    try {
        const user = await findByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken({
            userId: user.id,
            companyId: user.company_id,
            role: user.role,
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                company_id: user.company_id,
                name: user.name,
                email: user.email,
                role: user.role,
                manager_id: user.manager_id,
            },
        });
    } catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({ message: "Could not login" });
    }
}

module.exports = {
    signup,
    login,
};
