const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./TaskManager.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database.');

        // Initialize database tables if they don't exist
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS Users (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT NOT NULL,
                    Email TEXT NOT NULL UNIQUE,
                    Password TEXT NOT NULL
                );
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS Tasks (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    Priority TEXT NOT NULL,
                    AssignedTo TEXT,  -- Store list of user IDs as a JSON string
                    CheckList TEXT,  -- Store checklist items as a JSON string
                    IsBacklog BOOLEAN DEFAULT 0,
                    IsTodo BOOLEAN DEFAULT 0,
                    IsInProgress BOOLEAN DEFAULT 0,
                    IsDone BOOLEAN DEFAULT 0,
                    DueDate DATE,
                    CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (AssignedTo) REFERENCES Users(Id)
                );
            `);
        });
    }
});

module.exports = db;