const ApprovalRuleStep = require("../models/ApprovalRuleStep");
const ExpenseApproval = require("../models/ExpenseApproval");
const Expense = require("../models/Expense");
const ApprovalRule = require("../models/ApprovalRule");

/**
 * Creates expense_approval rows for each step in the assigned rule.
 * For sequential rules: only creates the FIRST step as 'pending'.
 * All subsequent steps are created as 'waiting' and unlocked one-by-one.
 * For percentage/specific rules: all steps are 'pending' simultaneously.
 *
 * @param {number} expenseId
 * @param {number} ruleId
 */
async function initializeApprovalChain(expenseId, ruleId) {
    const steps = await ApprovalRuleStep.findByRule(ruleId);
    if (!steps || steps.length === 0) {
        throw new Error(`No steps found for rule ${ruleId}`);
    }

    const rule = await ApprovalRule.findById(ruleId);
    const isSequential = rule && rule.rule_type === "sequential";

    const approvalRows = [];
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        // For sequential rules: first step is 'pending', rest are 'waiting'
        // For all others: all steps are 'pending' simultaneously
        const initialStatus = isSequential && i > 0 ? "waiting" : "pending";
        const approval = await ExpenseApproval.createWithStatus(
            expenseId,
            step.approver_id,
            step.step_order,
            initialStatus
        );
        approvalRows.push(approval);
    }
    return approvalRows;
}

/**
 * Approves or rejects a single expense_approval row, then checks completion.
 * For sequential rules: unlocks the next waiting step after current approval.
 *
 * @param {number} expenseApprovalId - The ID in expense_approvals table
 * @param {'approved'|'rejected'} status
 * @param {string} comments
 */
async function processApproval(expenseApprovalId, status, comments) {
    const updated = await ExpenseApproval.updateStatus(expenseApprovalId, status, comments);
    if (!updated) {
        throw new Error("Approval record not found");
    }

    const expenseId = updated.expense_id;

    // If rejected: mark expense rejected immediately
    if (status === "rejected") {
        await Expense.updateStatus(expenseId, "rejected");
        return { approval: updated, expenseStatus: "rejected" };
    }

    // Check if there is a sequential rule — if so, unlock the next step
    const expense = await Expense.findById(expenseId);
    if (expense && expense.rule_id) {
        const rule = await ApprovalRule.findById(expense.rule_id);
        if (rule && rule.rule_type === "sequential") {
            await unlockNextSequentialStep(expenseId, updated.step_number);
        }
    }

    const result = await checkApprovalCompletion(expenseId);
    return { approval: updated, expenseStatus: result };
}

/**
 * After step N is approved in a sequential chain,
 * activates the next waiting step (step N+1) by setting it to 'pending'.
 */
async function unlockNextSequentialStep(expenseId, justCompletedStep) {
    const allApprovals = await ExpenseApproval.findByExpense(expenseId);
    const nextStep = allApprovals.find(
        (a) => parseInt(a.step_number, 10) === parseInt(justCompletedStep, 10) + 1
            && a.status === "waiting"
    );
    if (nextStep) {
        await ExpenseApproval.updateStatus(parseInt(nextStep.id, 10), "pending", null);
    }
}

/**
 * Checks whether the expense is fully approved or still pending.
 * Handles percentage_threshold and specific_approver rules.
 * 'waiting' steps are ignored — only 'approved'/'pending' count.
 */
async function checkApprovalCompletion(expenseId) {
    const expense = await Expense.findById(expenseId);
    if (!expense) throw new Error("Expense not found");

    const allApprovals = await ExpenseApproval.findByExpense(expenseId);

    // Only count active steps (not 'waiting')
    const active = allApprovals.filter((a) => a.status !== "waiting");
    const anyRejected = allApprovals.some((a) => a.status === "rejected");

    if (anyRejected) {
        await Expense.updateStatus(expenseId, "rejected");
        return "rejected";
    }

    const total = allApprovals.length;
    const approvedCount = allApprovals.filter((a) => a.status === "approved").length;
    const waitingCount = allApprovals.filter((a) => a.status === "waiting").length;

    // For percentage rules: approve when threshold is reached across ALL steps
    if (expense.rule_id) {
        const rule = await ApprovalRule.findById(expense.rule_id);

        if (rule && rule.rule_type === "percentage" && rule.percentage_threshold) {
            const pct = (approvedCount / total) * 100;
            if (pct >= parseFloat(rule.percentage_threshold)) {
                await Expense.updateStatus(expenseId, "approved");
                return "approved";
            }
        }

        // For specific approver rule: if that specific approver approved → auto-approved
        if (rule && rule.rule_type === "specific" && rule.specific_approver_id) {
            const specificApproved = allApprovals.find(
                (a) => parseInt(a.approver_id, 10) === parseInt(rule.specific_approver_id, 10)
                    && a.status === "approved"
            );
            if (specificApproved) {
                await Expense.updateStatus(expenseId, "approved");
                return "approved";
            }
        }
    }

    // Sequential / default: all steps must be approved (none left waiting or pending)
    if (approvedCount === total) {
        await Expense.updateStatus(expenseId, "approved");
        return "approved";
    }

    return "pending";
}

module.exports = {
    initializeApprovalChain,
    processApproval,
    checkApprovalCompletion,
};
