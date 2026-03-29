const pool = require("../config/db");

async function createUser(client, payload) {
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

async function findUserByEmail(email) {
    const query = `
    SELECT id, company_id, name, email, password, role, manager_id, created_at
    FROM users
    WHERE email = $1
  `;

    const { rows } = await pool.query(query, [email.toLowerCase()]);
    return rows[0] || null;
}

module.exports = {
    createUser,
    findUserByEmail,
};
