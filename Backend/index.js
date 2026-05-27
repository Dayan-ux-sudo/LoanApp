const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/applications', (req, res) => {
  db.all("SELECT * FROM applications", [], (err, rows) => {
    if (err) return res.status(500).json({error: err});
    res.json(rows);
  });
});

app.get('/api/analytics/trends', (req, res) => {
  db.all(`
    SELECT 
      strftime('%Y-%m', date) as month,
      loan_type,
      COUNT(*) as count,
      SUM(amount) as total_amount
    FROM applications 
    GROUP BY month, loan_type
    ORDER BY month
  `, [], (err, rows) => {
    res.json(rows);
  });
});

app.get('/api/analytics/seasonal', (req, res) => {
  db.all(`
    SELECT season, loan_type, COUNT(*) as count, 
           AVG(applicant_age) as avg_age
    FROM applications 
    GROUP BY season, loan_type
  `, [], (err, rows) => res.json(rows));
});

app.post('/api/applications', (req, res) => {
  const { date, loan_type, amount, status, applicant_age, gender, season } = req.body;
  db.run(`INSERT INTO applications (date, loan_type, amount, status, applicant_age, gender, season) 
          VALUES (?,?,?,?,?,?,?)`, 
    [date, loan_type, amount, status, applicant_age, gender, season],
    function(err) {
      if (err) return res.status(500).json({error: err});
      res.json({id: this.lastID});
    }
  );
});

const PORT = 6000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));