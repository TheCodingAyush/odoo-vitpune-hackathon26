const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const ruleRoutes = require("./routes/ruleRoutes");
const currencyRoutes = require("./routes/currencyRoutes");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
    try {
        await pool.query("SELECT 1");
        return res.status(200).json({ status: "ok", database: "connected" });
    } catch (error) {
        return res.status(500).json({ status: "error", database: "disconnected" });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/currency", currencyRoutes);

app.use((req, res) => {
    return res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
