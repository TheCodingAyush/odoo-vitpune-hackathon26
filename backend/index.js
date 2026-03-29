const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
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

app.use((req, res) => {
    return res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
