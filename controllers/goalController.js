const db = require("../config/db");

exports.getGoals = async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM goals"
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.getGoalById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM goals WHERE goal_id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.createGoal = async (req, res) => {

    try {

        const {
            habit_id,
            user_id,
            title,
            description,
            target_value,
            target_period,
            start_date,
            end_date,
            status
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO goals
            (
                habit_id,
                user_id,
                title,
                description,
                target_value,
                target_period,
                start_date,
                end_date,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                habit_id,
                user_id,
                title,
                description,
                target_value,
                target_period,
                start_date,
                end_date,
                status
            ]
        );

        res.status(201).json({
            message: "Goal created successfully",
            goalId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.updateGoal = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            target_value,
            target_period,
            start_date,
            end_date,
            status
        } = req.body;

        const [result] = await db.query(
            `UPDATE goals
             SET
                title = ?,
                description = ?,
                target_value = ?,
                target_period = ?,
                start_date = ?,
                end_date = ?,
                status = ?
             WHERE goal_id = ?`,
            [
                title,
                description,
                target_value,
                target_period,
                start_date,
                end_date,
                status,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        res.json({
            message: "Goal updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.deleteGoal = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM goals WHERE goal_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        res.json({
            message: "Goal deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};