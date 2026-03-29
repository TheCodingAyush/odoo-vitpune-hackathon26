const express = require("express");
const {
    createUser,
    getAllUsers,
    updateRole,
    assignManager,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");

const router = express.Router();

// Apply auth and admin check to all routes on this router
router.use(auth, isAdmin);

router.post("/create", createUser);
router.get("/", getAllUsers);
router.patch("/:id/role", updateRole);
router.patch("/:id/manager", assignManager);

module.exports = router;
