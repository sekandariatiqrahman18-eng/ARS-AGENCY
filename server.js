const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("agency.db");

app.use(express.json());
app.use(express.static("public"));

// Create the table to store people who want to hire you
db.run(`
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    service TEXT,
    budget TEXT,
    message TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// 1. Receive data from the website
app.post("/hire-me", (req, res) => {
    const { name, email, service, budget, message } = req.body;
    db.run(
        "INSERT INTO leads (name, email, service, budget, message) VALUES (?, ?, ?, ?, ?)",
        [name, email, service, budget, message],
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.json({ success: true });
        }
    );
});

// 2. Send the data to your private dashboard
app.get("/api/leads", (req, res) => {
    db.all("SELECT * FROM leads ORDER BY date DESC", (err, rows) => {
        res.json(rows);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Agency is running at port ${PORT}`);
});