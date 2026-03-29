const pool = require("../config/db");

async function findById(id) {
    const query = `
        SELECT id, company_id, name, email, role, manager_id, created_at
        FROM users
        WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
}

async function findByEmail(email) {
    const query = `
        SELECT id, company_id, name, email, password, role, manager_id, created_at
        FROM users
        WHERE email = $1
    `;
    const { rows } = await pool.query(query, [email.toLowerCase()]);
    return rows[0] || null;
}

async function findAllByCompany(companyId) {
    const query = `
        SELECT id, company_id, name, email, role, manager_id, created_at
        FROM users
        WHERE company_id = $1
    `;
    const { rows } = await pool.query(query, [companyId]);
    return rows;
}

async function createUser(client, payload) {
    // Client support for transactions like signup authController
    const db = client || pool;
    const { companyId, name, email, passwordHash, role, managerId = null } = payload;

    const query = `
        INSERT INTO users (company_id, name, email, password, role, manager_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, company_id, name, email, role, manager_id, created_at
    `;
    const values = [companyId, name, email.toLowerCase(), passwordHash, role, managerId];
    const { rows } = await db.query(query, values);
    return rows[0];
}

async function updateRole(id, role) {
    const query = `
        UPDATE users
        SET role = $2
        WHERE id = $1
        RETURNING id, company_id, name, email, role, manager_id
    `;
    const { rows } = await pool.query(query, [id, role]);
    return rows[0] || null;
}

async function updateManager(id, managerId) {
    const query = `
        UPDATE users
        SET manager_id = $2
        WHERE id = $1
        RETURNING id, company_id, name, email, role, manager_id
    `;
    const { rows } = await pool.query(query, [id, managerId]);
    return rows[0] || null;
}

module.exports = {
    findById,
    findByEmail,
    findAllByCompany,
    createUser,
    updateRole,
    updateManager,
};
