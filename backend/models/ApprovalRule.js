const pool = require("../config/db");

async function create(companyId, name, ruleType, percentageThreshold, specificApproverId) {
    const query = `
        INSERT INTO approval_rules (company_id, name, rule_type, percentage_threshold, specific_approver_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const { rows } = await pool.query(query, [companyId, name, ruleType, percentageThreshold || null, specificApproverId || null]);
    return rows[0];
}

async function findByCompany(companyId) {
    const query = `
        SELECT * FROM approval_rules
        WHERE company_id = $1
        ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [companyId]);
    return rows;
}

async function findById(id) {
    const query = `SELECT * FROM approval_rules WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
}

module.exports = {
    create,
    findByCompany,
    findById,
};
