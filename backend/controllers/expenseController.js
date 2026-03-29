const Expense = require("../models/Expense");
const ApprovalRule = require("../models/ApprovalRule");
const { convertAmount } = require("../utils/currencyHelper");
const { initializeApprovalChain } = require("../utils/approvalEngine");
const { findById: findCompanyById } = require("../models/Company");

/**
 * POST /api/expenses
 * Employee submits a new expense. Currency is converted to company base currency.
 * The approval chain is auto-initialized using the company's first rule.
 * An explicit ruleId in the body overrides the default.
 */
async function submitExpense(req, res) {
    const { amount, currency, category, description, date, ruleId: explicitRuleId } = req.body;
    const { userId: employeeId, companyId } = req.user;

    if (!amount || !currency || !category || !description || !date) {
        return res.status(400).json({ message: "amount, currency, category, description, and date are required" });
    }
    if (parseFloat(amount) <= 0) {
        return res.status(400).json({ message: "Amount must be positive" });
    }

    try {
        // Fetch company to get base currency for conversion
        const company = await findCompanyById(companyId);
        if (!company) return res.status(404).json({ message: "Company not found" });

        const baseCurrency = company.currency;
        const convertedAmount = await convertAmount(parseFloat(amount), currency, baseCurrency);

        const expense = await Expense.createExpense(
            employeeId, companyId, parseFloat(amount), currency.toUpperCase(),
            convertedAmount, category, description, date
        );

        // Auto-find rule: use explicit ruleId or fall back to first company rule
        let resolvedRuleId = explicitRuleId || null;
        if (!resolvedRuleId) {
            const companyRules = await ApprovalRule.findByCompany(companyId);
            if (companyRules && companyRules.length > 0) {
                resolvedRuleId = companyRules[0].id;
            }
        }

        let approvalChain = null;
        if (resolvedRuleId) {
            const rule = await ApprovalRule.findById(resolvedRuleId);
            if (!rule || rule.company_id !== companyId) {
                return res.status(400).json({ message: "Invalid or unauthorized rule" });
            }
            // Store rule_id on the expense for the approval engine to reference
            await Expense.setRuleId(expense.id, resolvedRuleId);
            expense.rule_id = resolvedRuleId;
            approvalChain = await initializeApprovalChain(expense.id, resolvedRuleId);
        }

        return res.status(201).json({
            message: "Expense submitted successfully",
            expense,
            approvalChain,
        });
    } catch (error) {
        console.error("Error submitting expense:", error);
        return res.status(500).json({ message: "Could not submit expense" });
    }
}

/**
 * GET /api/expenses/my
 * Employee sees their own expenses.
 */
async function getMyExpenses(req, res) {
    const { userId: employeeId } = req.user;
    try {
        const expenses = await Expense.findByEmployee(employeeId);
        return res.status(200).json({ expenses });
    } catch (error) {
        console.error("Error fetching my expenses:", error);
        return res.status(500).json({ message: "Could not fetch expenses" });
    }
}

/**
 * GET /api/expenses/all
 * Admin sees all expenses in the company.
 */
async function getAllExpenses(req, res) {
    const { companyId } = req.user;
    try {
        const expenses = await Expense.findByCompany(companyId);
        return res.status(200).json({ expenses });
    } catch (error) {
        console.error("Error fetching all expenses:", error);
        return res.status(500).json({ message: "Could not fetch expenses" });
    }
}

/**
 * GET /api/expenses/pending
 * Manager sees expenses submitted by their direct reports that are pending.
 */
async function getPendingApprovals(req, res) {
    const { userId: managerId } = req.user;
    try {
        const expenses = await Expense.findPendingForManager(managerId);
        return res.status(200).json({ expenses });
    } catch (error) {
        console.error("Error fetching pending approvals:", error);
        return res.status(500).json({ message: "Could not fetch pending approvals" });
    }
}

module.exports = {
    submitExpense,
    getMyExpenses,
    getAllExpenses,
    getPendingApprovals,
};
