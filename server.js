const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("agency.db");

app.use(express.json());

// This line tells the server EXACTLY where the public folder is on the internet
app.use(express.static(path.join(__dirname, "public")));

// Database setup
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

// Route to handle requests
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

// Route to get data for your dashboard
app.get("/api/leads", (req, res) => {
    db.all("SELECT * FROM leads ORDER BY date DESC", (err, rows) => {
        res.json(rows);
    });
});

// THIS IS THE FIX: Explicitly tell the server to serve index.html when people visit the main link
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Agency is running on port ${PORT}`);
});