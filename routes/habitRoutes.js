const express = require("express");
const router = express.Router();

const {
    getHabits,
    createHabit,
    getHabitById,
    updateHabit,
    deleteHabit,
    createHabitLog,
    getHabitLogs
} = require("../controllers/habitController");

router.get("/", getHabits);
router.get("/:id", getHabitById);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/logs", createHabitLog);
router.get("/:id/logs", getHabitLogs);

module.exports = router;