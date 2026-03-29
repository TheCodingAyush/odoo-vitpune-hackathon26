const pool = require("../config/db");

async function create(expenseId, approverId, stepNumber) {
    const query = `
        INSERT INTO expense_approvals (expense_id, approver_id, step_number, status)
        VALUES ($1, $2, $3, 'pending')
        RETURNING *
    `;
    const { rows } = await pool.query(query, [expenseId, approverId, stepNumber]);
    return rows[0];
}

async function findByExpense(expenseId) {
    const query = `
        SELECT ea.*, u.name AS approver_name, u.role AS approver_role
        FROM expense_approvals ea
        JOIN users u ON ea.approver_id = u.id
        WHERE ea.expense_id = $1
        ORDER BY ea.step_number ASC
    `;
    const { rows } = await pool.query(query, [expenseId]);
    return rows;
}

async function updateStatus(id, status, comments) {
    const query = `
        UPDATE expense_approvals
        SET status = $2, comments = $3, acted_at = NOW()
        WHERE id = $1
        RETURNING *
    `;
    const { rows } = await pool.query(query, [id, status, comments || null]);
    return rows[0] || null;
}

async function findPendingByApprover(approverId) {
    const query = `
        SELECT ea.*, e.amount, e.currency, e.converted_amount, e.category, e.description, e.date,
               u.name AS employee_name
        FROM expense_approvals ea
        JOIN expenses e ON ea.expense_id = e.id
        JOIN users u ON e.employee_id = u.id
        WHERE ea.approver_id = $1 AND ea.status = 'pending'
        ORDER BY ea.created_at ASC
    `;
    const { rows } = await pool.query(query, [approverId]);
    return rows;
}

module.exports = {
    create,
    findByExpense,
    updateStatus,
    findPendingByApprover,
};
