const pool = require("../config/db");

async function createExpenseApproval(payload) {
    const { expenseId, approverId, stepNumber, status = "pending", comments = null, actedAt = null } = payload;

    const query = `
    INSERT INTO expense_approvals (
      expense_id,
      approver_id,
      step_number,
      status,
      comments,
      acted_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

    const values = [expenseId, approverId, stepNumber, status, comments, actedAt];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

module.exports = {
    createExpenseApproval,
};
