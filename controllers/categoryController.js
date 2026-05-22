const db = require("../config/db");

exports.getCategories = async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM categories"
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.createCategory = async (req, res) => {

    try {

        const {
            user_id,
            name,
            color,
            icon
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO categories
            (user_id, name, color, icon)
            VALUES (?, ?, ?, ?)`,
            [
                user_id,
                name,
                color,
                icon
            ]
        );

        res.status(201).json({
            message: "Category created successfully",
            categoryId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.getCategoryById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM categories WHERE category_id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
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

exports.updateCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            color,
            icon
        } = req.body;

        const [result] = await db.query(
            `UPDATE categories
             SET
                name = ?,
                color = ?,
                icon = ?
             WHERE category_id = ?`,
            [
                name,
                color,
                icon,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json({
            message: "Category updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.deleteCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM categories WHERE category_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json({
            message: "Category deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};