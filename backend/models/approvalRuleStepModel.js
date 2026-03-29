const pool = require("../config/db");

async function createApprovalRuleStep(payload) {
    const { ruleId, approverId, stepOrder } = payload;

    const query = `
    INSERT INTO approval_rule_steps (rule_id, approver_id, step_order)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

    const { rows } = await pool.query(query, [ruleId, approverId, stepOrder]);
    return rows[0];
}

module.exports = {
    createApprovalRuleStep,
};
