const db = require('../config/db')

const getUser = (req, res) => {
    const sql = "SELECT * FROM users where IsActive = 1";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.status(200).json({
            message: "Users fetched",
            data: results
        });
    });
};

const getUserById = (req, res) => {
    const userId = req.params.id
    const sql = "SELECT * FROM users where userId = ? and IsActive = 1";

    db.query(sql, userId, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if(results.length === 0){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User fetched",
            data: results
        });
    });
};

const createUser = (req , res) => {
    const { firstName, lastName, email, gender, jobTitle } = req.body;
    const loginUser = req.user.username

    // Check required fields
    if (!firstName || !lastName || !gender || !jobTitle) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = `INSERT INTO users (firstName, lastName, email, gender, jobTitle, createdBy, modifiedBy) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [firstName, lastName, email, gender, jobTitle, loginUser, loginUser], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "User ID already exists" });
            }

            return res.status(500).json({ message: "Database error" });
        }

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertId
        });
    });
};

const updateUser = (req, res) => {
    const userId = req.params.id;
    const loginUser = req.user.username
    const { firstName, lastName, email, gender, jobTitle } = req.body;

    // Build dynamic update query
    let updates = [];
    let values = [];

    if (firstName) {
        updates.push("firstName = ?");
        values.push(firstName);
    }
    if (lastName) {
        updates.push("lastName = ?");
        values.push(lastName);
    }
    if(email) {
        updates.push("email = ?");
        values.push(email);
    }
    if (gender) {
        updates.push("gender = ?");
        values.push(gender);
    }
    if (jobTitle) {
        updates.push("jobTitle = ?");
        values.push(jobTitle);
    }

    if (updates.length === 0) {
        return res.status(400).json({
            message: "Provide at least one field to update"
        });
    }

    updates.push("modifiedBy = ?");
    values.push(loginUser);

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE userId = ?`;

    values.push(userId);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Update error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `User not found with userId ${userId}` });
        }

        return res.json({ message: "User updated successfully" });
    });
};

const deleteUser = (req, res) => {
    const userId  = req.params.id;
    const loginUser = req.user.username

    const sql = `UPDATE users SET IsActive = 0, modifiedBy = ? WHERE userId = ?`;

    db.query(sql, [userId,loginUser], (err, result) => {
        if (err) {
            console.error("Delete error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: `User deleted successfully of userId ${userId}` });
    });
};

module.exports = {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}