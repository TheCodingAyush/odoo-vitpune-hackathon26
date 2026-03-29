const pool = require("../config/db");

async function createCompany(client, payload) {
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
    createCompany,
};
