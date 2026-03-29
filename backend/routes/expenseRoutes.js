const express = require("express");
const {
    submitExpense,
    getMyExpenses,
    getAllExpenses,
    getPendingApprovals,
} = require("../controllers/expenseController");
const auth = require("../middleware/auth");
const { isAdmin, isManager } = require("../middleware/roleCheck");

const router = express.Router();

// All expense routes require authentication
router.use(auth);

// Employee: submit expense and view own expenses (any authenticated user can submit)
router.post("/", submitExpense);
router.get("/my", getMyExpenses);

// Manager: view pending approvals for their direct reports
router.get("/pending", isManager, getPendingApprovals);

// Admin: view all company expenses
router.get("/all", isAdmin, getAllExpenses);

module.exports = router;
