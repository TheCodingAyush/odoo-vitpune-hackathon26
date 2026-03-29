const pool = require("../config/db");

async function create(ruleId, approverId, stepOrder) {
    const query = `
        INSERT INTO approval_rule_steps (rule_id, approver_id, step_order)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const { rows } = await pool.query(query, [ruleId, approverId, stepOrder]);
    return rows[0];
}

async function findByRule(ruleId) {
    const query = `
        SELECT ars.*, u.name AS approver_name, u.role AS approver_role
        FROM approval_rule_steps ars
        JOIN users u ON ars.approver_id = u.id
        WHERE ars.rule_id = $1
        ORDER BY ars.step_order ASC
    `;
    const { rows } = await pool.query(query, [ruleId]);
    return rows;
}

module.exports = {
    create,
    findByRule,
};
