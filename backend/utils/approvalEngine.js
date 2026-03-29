const ApprovalRuleStep = require("../models/ApprovalRuleStep");
const ExpenseApproval = require("../models/ExpenseApproval");
const Expense = require("../models/Expense");
const ApprovalRule = require("../models/ApprovalRule");

/**
 * Creates expense_approval rows for each step in the assigned rule.
 * @param {number} expenseId
 * @param {number} ruleId
 */
async function initializeApprovalChain(expenseId, ruleId) {
    const steps = await ApprovalRuleStep.findByRule(ruleId);
    if (!steps || steps.length === 0) {
        throw new Error(`No steps found for rule ${ruleId}`);
    }

    const approvalRows = [];
    for (const step of steps) {
        const approval = await ExpenseApproval.create(expenseId, step.approver_id, step.step_order);
        approvalRows.push(approval);
    }
    return approvalRows;
}

/**
 * Approves or rejects a single expense_approval row, then checks completion.
 * @param {number} expenseApprovalId - The ID in expense_approvals table
 * @param {'approved'|'rejected'} status
 * @param {string} comments
 */
async function processApproval(expenseApprovalId, status, comments) {
    const updated = await ExpenseApproval.updateStatus(expenseApprovalId, status, comments);
    if (!updated) {
        throw new Error("Approval record not found");
    }

    const result = await checkApprovalCompletion(updated.expense_id);
    return { approval: updated, expenseStatus: result };
}

/**
 * Checks whether the expense is fully approved, partially approved, or rejected.
 * Handles percentage_threshold (e.g. 60% rule) and specific_approver rules.
 */
async function checkApprovalCompletion(expenseId) {
    const expense = await Expense.findById(expenseId);
    if (!expense) throw new Error("Expense not found");

    const allApprovals = await ExpenseApproval.findByExpense(expenseId);

    // If any step is rejected, mark the whole expense as rejected
    const anyRejected = allApprovals.some((a) => a.status === "rejected");
    if (anyRejected) {
        await Expense.updateStatus(expenseId, "rejected");
        return "rejected";
    }

    const total = allApprovals.length;
    const approvedCount = allApprovals.filter((a) => a.status === "approved").length;
    const pendingCount = allApprovals.filter((a) => a.status === "pending").length;

    // If there is an associated rule, check its type
    // We look up the rule via the expense's rule assignment (rule_id stored on expense if exists)
    // For percentage_threshold rules: approve once threshold is reached
    if (expense.rule_id) {
        const rule = await ApprovalRule.findById(expense.rule_id);
        if (rule && rule.rule_type === "percentage" && rule.percentage_threshold) {
            const pct = (approvedCount / total) * 100;
            if (pct >= rule.percentage_threshold) {
                await Expense.updateStatus(expenseId, "approved");
                return "approved";
            }
        }
    }

    // Default: all steps must be approved
    if (approvedCount === total) {
        await Expense.updateStatus(expenseId, "approved");
        return "approved";
    }

    // Still pending steps
    if (pendingCount > 0) {
        return "pending";
    }

    return "pending";
}

module.exports = {
    initializeApprovalChain,
    processApproval,
    checkApprovalCompletion,
};
