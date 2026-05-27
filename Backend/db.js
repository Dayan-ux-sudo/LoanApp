const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Change to './loans.db' for persistence

db.serialize(() => {
  db.run(`CREATE TABLE applications (
    id INTEGER PRIMARY KEY,
    date TEXT,
    loan_type TEXT,
    amount REAL,
    status TEXT,
    applicant_age INTEGER,
    gender TEXT,
    season TEXT
  )`);

  // Seed sample data
  const stmt = db.prepare(`INSERT INTO applications (date, loan_type, amount, status, applicant_age, gender, season) VALUES (?,?,?,?,?,?,?)`);
  
  const sampleData = [
    ["2026-01-15", "Auto", 25000, "Approved", 28, "Male", "Winter"],
    ["2026-02-20", "Personal", 8000, "Approved", 35, "Female", "Winter"],
    ["2026-09-05", "Auto", 32000, "Approved", 27, "Male", "Fall"],
    ["2026-10-12", "Home", 180000, "Pending", 42, "Male", "Fall"],
    // Add more as needed...
  ];

  sampleData.forEach(row => stmt.run(row));
  stmt.finalize();
});

module.exports = db;