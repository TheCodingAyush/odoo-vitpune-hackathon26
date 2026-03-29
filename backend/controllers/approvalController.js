const ExpenseApproval = require("../models/ExpenseApproval");
const { processApproval } = require("../utils/approvalEngine");
const pool = require("../config/db");

/**
 * POST /api/approvals/:id/action
 * Manager or admin approves or rejects a specific expense_approval row.
 * Triggers the approval engine to check for chain completion.
 */
async function approveOrReject(req, res) {
    const { id } = req.params;
    const { status, comments } = req.body;
    const { userId: approverId, companyId } = req.user;

    if (!status || !["approved", "rejected", "escalated"].includes(status)) {
        return res.status(400).json({ message: "status must be 'approved', 'rejected', or 'escalated'" });
    }

    try {
        // Fetch the approval record and verify ownership
        const pendingApprovals = await ExpenseApproval.findPendingByApprover(approverId);
        const match = pendingApprovals.find((a) => parseInt(a.id, 10) === parseInt(id, 10));

        if (!match) {
            return res.status(403).json({ message: "Approval record not found or not assigned to you" });
        }

        if (status === "escalated") {
            const adminQuery = await pool.query(
                "SELECT id FROM users WHERE company_id = $1 AND role = 'admin' LIMIT 1",
                [companyId]
            );
            if (adminQuery.rows.length === 0) {
                return res.status(404).json({ message: "No admin found for escalation" });
            }
            const adminId = adminQuery.rows[0].id;
            
            await pool.query(
                "UPDATE expense_approvals SET approver_id = $1, comments = $2 WHERE id = $3",
                [adminId, "[ESCALATED] " + (comments || ""), parseInt(id, 10)]
            );
            
            return res.status(200).json({
                message: "Expense escalated to Admin successfully",
                approval: { ...match, approver_id: adminId },
                expenseStatus: "pending"
            });
        }

        const result = await processApproval(parseInt(id, 10), status, comments);

        return res.status(200).json({
            message: `Expense ${status} successfully`,
            approval: result.approval,
            expenseStatus: result.expenseStatus,
        });
    } catch (error) {
        console.error("Error processing approval:", error);
        return res.status(500).json({ message: "Could not process approval" });
    }
}

/**
 * GET /api/approvals/queue
 * Returns all pending expense_approval rows assigned to the logged-in user.
 */
async function getApprovalQueue(req, res) {
    const { userId: approverId } = req.user;
    try {
        const queue = await ExpenseApproval.findPendingByApprover(approverId);
        return res.status(200).json({ queue });
    } catch (error) {
        console.error("Error fetching approval queue:", error);
        return res.status(500).json({ message: "Could not fetch approval queue" });
    }
}

module.exports = {
    approveOrReject,
    getApprovalQueue,
};
