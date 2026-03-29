const pool = require("../config/db");

async function createApprovalRule(payload) {
    const { companyId, name, ruleType, percentageThreshold = null, specificApproverId = null } = payload;

    const query = `
    INSERT INTO approval_rules (
      company_id,
      name,
      rule_type,
      percentage_threshold,
      specific_approver_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

    const values = [companyId, name, ruleType, percentageThreshold, specificApproverId];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

module.exports = {
    createApprovalRule,
};
