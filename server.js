const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const habitRoutes = require("./routes/habitRoutes");

app.use("/api/habits", habitRoutes);

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const categoryRoutes = require("./routes/categoryRoutes");

app.use("/api/categories", categoryRoutes);

const goalRoutes = require("./routes/goalRoutes");

app.use("/api/goals", goalRoutes);

const reportRoutes = require("./routes/reportRoutes");

app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.send("Habit Tracker Backend Running");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});