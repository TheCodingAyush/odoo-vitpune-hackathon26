const { fetchRate, convertAmount } = require("../utils/currencyHelper");

/**
 * GET /api/currency/rate?from=USD&to=INR
 */
async function getConversionRate(req, res) {
    const { from, to } = req.query;
    if (!from || !to) {
        return res.status(400).json({ message: "Query params 'from' and 'to' are required" });
    }
    try {
        const rate = await fetchRate(from, to);
        return res.status(200).json({ from: from.toUpperCase(), to: to.toUpperCase(), rate });
    } catch (error) {
        console.error("Error fetching rate:", error.message);
        return res.status(502).json({ message: error.message || "Failed to fetch exchange rate" });
    }
}

/**
 * GET /api/currency/convert?amount=100&from=USD&to=INR
 */
async function convertAmountHandler(req, res) {
    const { amount, from, to } = req.query;
    if (!amount || !from || !to) {
        return res.status(400).json({ message: "Query params 'amount', 'from', and 'to' are required" });
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
    }
    try {
        const converted = await convertAmount(numAmount, from, to);
        return res.status(200).json({
            original: { amount: numAmount, currency: from.toUpperCase() },
            converted: { amount: converted, currency: to.toUpperCase() },
        });
    } catch (error) {
        console.error("Error converting amount:", error.message);
        return res.status(502).json({ message: error.message || "Failed to convert amount" });
    }
}

module.exports = {
    getConversionRate,
    convertAmount: convertAmountHandler,
};
