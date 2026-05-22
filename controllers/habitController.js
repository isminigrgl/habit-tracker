const db = require("../config/db");

exports.getHabits = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM habits");

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.createHabit = async (req, res) => {
    try {

        const {
            user_id,
            category_id,
            name,
            description,
            frequency,
            target_count,
            start_date,
            end_date
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO habits 
            (user_id, category_id, name, description, frequency, target_count, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                category_id,
                name,
                description,
                frequency,
                target_count,
                start_date,
                end_date
            ]
        );

        res.status(201).json({
            message: "Habit created successfully",
            habitId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.getHabitById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM habits WHERE habit_id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Habit not found"
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

exports.updateHabit = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            category_id,
            name,
            description,
            frequency,
            target_count,
            start_date,
            end_date,
            is_active
        } = req.body;

        const [result] = await db.query(
            `UPDATE habits
             SET
                category_id = ?,
                name = ?,
                description = ?,
                frequency = ?,
                target_count = ?,
                start_date = ?,
                end_date = ?,
                is_active = ?
             WHERE habit_id = ?`,
            [
                category_id,
                name,
                description,
                frequency,
                target_count,
                start_date,
                end_date,
                is_active,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Habit not found"
            });
        }

        res.json({
            message: "Habit updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.deleteHabit = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM habits WHERE habit_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Habit not found"
            });
        }

        res.json({
            message: "Habit deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.createHabitLog = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            completion_date,
            status,
            notes
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO habit_logs
            (habit_id, completion_date, status, notes)
            VALUES (?, ?, ?, ?)`,
            [
                id,
                completion_date,
                status,
                notes
            ]
        );

        res.status(201).json({
            message: "Habit log created successfully",
            logId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.getHabitLogs = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM habit_logs
             WHERE habit_id = ?`,
            [id]
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};