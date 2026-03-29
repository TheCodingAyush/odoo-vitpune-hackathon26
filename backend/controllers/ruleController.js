const ApprovalRule = require("../models/ApprovalRule");
const ApprovalRuleStep = require("../models/ApprovalRuleStep");
const Expense = require("../models/Expense");
const { initializeApprovalChain } = require("../utils/approvalEngine");

/**
 * POST /api/rules
 * Admin creates an approval rule with optional ordered steps.
 *
 * Body:
 * {
 *   name: string,
 *   ruleType: 'percentage' | 'specific' | 'sequential',
 *   percentageThreshold: number (optional, required when ruleType='percentage'),
 *   specificApproverId: number (optional, required when ruleType='specific'),
 *   steps: [{ approverId, stepOrder }] (optional list for sequential or committee rules)
 * }
 */
async function createRule(req, res) {
    const { name, ruleType, percentageThreshold, specificApproverId, steps } = req.body;
    const { companyId } = req.user;

    if (!name || !ruleType) {
        return res.status(400).json({ message: "name and ruleType are required" });
    }

    const validTypes = ["percentage", "specific", "sequential"];
    if (!validTypes.includes(ruleType)) {
        return res.status(400).json({ message: `ruleType must be one of: ${validTypes.join(", ")}` });
    }

    try {
        const rule = await ApprovalRule.create(
            companyId, name, ruleType,
            percentageThreshold || null,
            specificApproverId || null
        );

        // Create steps if provided
        const createdSteps = [];
        if (Array.isArray(steps) && steps.length > 0) {
            for (const step of steps) {
                if (!step.approverId || step.stepOrder === undefined) continue;
                const s = await ApprovalRuleStep.create(rule.id, step.approverId, step.stepOrder);
                createdSteps.push(s);
            }
        }

        return res.status(201).json({ message: "Rule created", rule, steps: createdSteps });
    } catch (error) {
        console.error("Error creating rule:", error);
        return res.status(500).json({ message: "Could not create rule" });
    }
}

/**
 * GET /api/rules
 * Admin lists all rules for the company, including their steps.
 */
async function getRules(req, res) {
    const { companyId } = req.user;
    try {
        const rules = await ApprovalRule.findByCompany(companyId);
        // Enrich each rule with its steps
        const enriched = await Promise.all(
            rules.map(async (rule) => {
                const steps = await ApprovalRuleStep.findByRule(rule.id);
                return { ...rule, steps };
            })
        );
        return res.status(200).json({ rules: enriched });
    } catch (error) {
        console.error("Error fetching rules:", error);
        return res.status(500).json({ message: "Could not fetch rules" });
    }
}

/**
 * POST /api/rules/assign
 * Admin assigns an existing rule to a specific expense and initializes the approval chain.
 * Body: { expenseId, ruleId }
 */
async function assignRuleToExpense(req, res) {
    const { expenseId, ruleId } = req.body;
    const { companyId } = req.user;

    if (!expenseId || !ruleId) {
        return res.status(400).json({ message: "expenseId and ruleId are required" });
    }

    try {
        const expense = await Expense.findById(expenseId);
        if (!expense || expense.company_id !== companyId) {
            return res.status(404).json({ message: "Expense not found or unauthorised" });
        }

        const rule = await ApprovalRule.findById(ruleId);
        if (!rule || rule.company_id !== companyId) {
            return res.status(404).json({ message: "Rule not found or unauthorised" });
        }

        const approvalChain = await initializeApprovalChain(expenseId, ruleId);

        return res.status(201).json({
            message: "Rule assigned and approval chain initialized",
            approvalChain,
        });
    } catch (error) {
        console.error("Error assigning rule:", error);
        return res.status(500).json({ message: "Could not assign rule to expense" });
    }
}

module.exports = {
    createRule,
    getRules,
    assignRuleToExpense,
};
