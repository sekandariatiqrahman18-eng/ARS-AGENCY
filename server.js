const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("agency.db");

app.use(express.json());

// FIXED: Changed "public" to "Public" to match your GitHub folder name
app.use(express.static(path.join(__dirname, "Public")));

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

app.get("/api/leads", (req, res) => {
    db.all("SELECT * FROM leads ORDER BY date DESC", (err, rows) => {
        res.json(rows);
    });
});

// FIXED: Changed "public" to "Public" here as well
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Agency is running on port ${PORT}`);
});