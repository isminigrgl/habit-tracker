const db = require("../config/db");

exports.getStatistics = async (req, res) => {

    try {

        const [totalLogs] = await db.query(
            "SELECT COUNT(*) AS total FROM habit_logs"
        );

        const [completedLogs] = await db.query(
            `SELECT COUNT(*) AS completed
             FROM habit_logs
             WHERE status = 'completed'`
        );

        const [skippedLogs] = await db.query(
            `SELECT COUNT(*) AS skipped
             FROM habit_logs
             WHERE status = 'skipped'`
        );

        const [missedLogs] = await db.query(
            `SELECT COUNT(*) AS missed
             FROM habit_logs
             WHERE status = 'missed'`
        );

        const total = totalLogs[0].total;
        const completed = completedLogs[0].completed;
        const skipped = skippedLogs[0].skipped;
        const missed = missedLogs[0].missed;

        const completionRate =
            total === 0
                ? 0
                : ((completed / total) * 100).toFixed(2);

        res.json({
            total_logs: total,
            completed_logs: completed,
            skipped_logs: skipped,
            missed_logs: missed,
            completion_rate: `${completionRate}%`
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};