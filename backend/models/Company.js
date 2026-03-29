const pool = require("../config/db");

async function findById(id) {
    const query = `
        SELECT id, name, country, currency, created_at
        FROM companies
        WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
}

async function create(client, payload) {
    // Optionally accept a client for transactions, fallback to pool
    const db = client || pool;
    const { name, country, currency } = payload;

    const query = `
        INSERT INTO companies (name, country, currency)
        VALUES ($1, $2, $3)
        RETURNING id, name, country, currency, created_at
    `;

    const { rows } = await db.query(query, [name, country, currency]);
    return rows[0];
}

module.exports = {
    findById,
    create,
};
