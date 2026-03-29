const pool = require("../config/db");

async function createExpense(employeeId, companyId, amount, currency, convertedAmount, category, description, date) {
    const query = `
        INSERT INTO expenses (employee_id, company_id, amount, currency, converted_amount, category, description, date, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
        RETURNING *
    `;
    const { rows } = await pool.query(query, [employeeId, companyId, amount, currency, convertedAmount, category, description, date]);
    return rows[0];
}

async function findByEmployee(employeeId) {
    const query = `
        SELECT * FROM expenses
        WHERE employee_id = $1
        ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [employeeId]);
    return rows;
}

async function findByCompany(companyId) {
    const query = `
        SELECT e.*, u.name AS employee_name
        FROM expenses e
        JOIN users u ON e.employee_id = u.id
        WHERE e.company_id = $1
        ORDER BY e.created_at DESC
    `;
    const { rows } = await pool.query(query, [companyId]);
    return rows;
}

async function findPendingForManager(managerId) {
    const query = `
        SELECT e.*, u.name AS employee_name
        FROM expenses e
        JOIN users u ON e.employee_id = u.id
        WHERE u.manager_id = $1 AND e.status = 'pending'
        ORDER BY e.created_at DESC
    `;
    const { rows } = await pool.query(query, [managerId]);
    return rows;
}

async function findById(id) {
    const query = `SELECT * FROM expenses WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
}

async function updateStatus(id, status) {
    const query = `
        UPDATE expenses
        SET status = $2
        WHERE id = $1
        RETURNING *
    `;
    const { rows } = await pool.query(query, [id, status]);
    return rows[0] || null;
}

async function setRuleId(id, ruleId) {
    // Add rule_id column if it doesn't exist, then store the value
    await pool.query(`
        ALTER TABLE expenses ADD COLUMN IF NOT EXISTS rule_id BIGINT REFERENCES approval_rules(id)
    `);
    const query = `UPDATE expenses SET rule_id = $2 WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id, ruleId]);
    return rows[0] || null;
}

module.exports = {
    createExpense,
    findByEmployee,
    findByCompany,
    findPendingForManager,
    findById,
    updateStatus,
    setRuleId,
};
