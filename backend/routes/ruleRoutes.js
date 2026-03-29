const express = require("express");
const { createRule, getRules, assignRuleToExpense } = require("../controllers/ruleController");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");

const router = express.Router();

// All rule routes require auth + admin role
router.use(auth, isAdmin);

router.post("/", createRule);
router.get("/", getRules);
router.post("/assign", assignRuleToExpense);

module.exports = router;
