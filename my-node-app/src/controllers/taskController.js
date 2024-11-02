const bcrypt = require('bcryptjs');
const db = require('../models/db');

// Register user
async function registerUser(req, res) {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        `INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword],
        function (err) {
            if (err) {
                res.status(500).send('Error registering user');
            } else {
                res.status(201).send('User registered');
            }
        }
    );
}

// Login user
async function loginUser(req, res) {
    const { email, password } = req.body;

    db.get(`SELECT * FROM Users WHERE Email = ?`, [email], async (err, user) => {
        if (err) {
            res.status(500).send('Error logging in');
        } else if (user && await bcrypt.compare(password, user.Password)) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
}

// Create new task
async function createTask(req, res) {
    const { title, priority, assignedTo, dueDate } = req.body;

    db.run(
        `INSERT INTO Tasks (Title, Priority, AssignedTo, DueDate) VALUES (?, ?, ?, ?)`,
        [title, priority, assignedTo, dueDate],
        function (err) {
            if (err) {
                res.status(500).send('Error creating task');
            } else {
                res.status(201).send('Task created');
            }
        }
    );
}

// Filter tasks by due date
async function filterTasks(req, res) {
    const { filterOption } = req.params;
    let query;
    const currentDate = new Date();

    if (filterOption === 'today') {
        query = `SELECT * FROM Tasks WHERE DATE(DueDate) = DATE('now')`;
    } else if (filterOption === 'this_week') {
        query = `SELECT * FROM Tasks WHERE DueDate BETWEEN DATE('now', 'weekday 0', '-7 days') AND DATE('now', 'weekday 6')`;
    } else if (filterOption === 'this_month') {
        query = `SELECT * FROM Tasks WHERE strftime('%m', DueDate) = strftime('%m', 'now')`;
    } else if (filterOption === 'this_year') {
        query = `SELECT * FROM Tasks WHERE strftime('%Y', DueDate) = strftime('%Y', 'now')`;
    }

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching tasks');
        } else {
            res.status(200).json(rows);
        }
    });
}

module.exports = {
    registerUser,
    loginUser,
    createTask,
    filterTasks
};
