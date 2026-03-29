const pool = require("../config/db");

async function createExpense(payload) {
    const {
        employeeId,
        companyId,
        amount,
        currency,
        convertedAmount,
        category,
        description,
        date,
        receiptUrl,
    } = payload;

    const query = `
    INSERT INTO expenses (
      employee_id,
      company_id,
      amount,
      currency,
      converted_amount,
      category,
      description,
      date,
      receipt_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

    const values = [
        employeeId,
        companyId,
        amount,
        currency,
        convertedAmount,
        category,
        description,
        date,
        receiptUrl,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
}

module.exports = {
    createExpense,
};
