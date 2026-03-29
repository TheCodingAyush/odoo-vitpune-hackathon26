const express = require("express");
const { getConversionRate, convertAmount } = require("../controllers/currencyController");
const auth = require("../middleware/auth");

const router = express.Router();

// Currency routes require authentication
router.use(auth);

router.get("/rate", getConversionRate);
router.get("/convert", convertAmount);

module.exports = router;
