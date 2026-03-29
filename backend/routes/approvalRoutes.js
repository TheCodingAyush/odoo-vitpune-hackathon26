const express = require("express");
const { approveOrReject, getApprovalQueue } = require("../controllers/approvalController");
const auth = require("../middleware/auth");

const router = express.Router();

// All approval routes require authentication (manager or admin can act)
router.use(auth);

// GET pending approval queue for the logged-in user
router.get("/queue", getApprovalQueue);

// POST approve or reject a specific approval record
router.post("/:id/action", approveOrReject);

module.exports = router;
