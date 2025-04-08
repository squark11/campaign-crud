const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3')
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('./kampanie.db');

// Tworzenie tabel
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT,
      keywords TEXT,
      bid REAL,
      fund REAL,
      status TEXT,
      town TEXT,
      radius INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS account (
      id INTEGER PRIMARY KEY,
      balance REAL
    )
  `);

  const rows = db.prepare('SELECT * FROM campaigns').all();
res.json(rows);
});

// CRUD kampanii
app.get('/api/campaigns', (req, res) => {
  db.all('SELECT * FROM campaigns', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/balance', (req, res) => {
  db.get('SELECT balance FROM account WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ balance: row?.balance || 0 });
  });
});

app.post('/api/campaigns', (req, res) => {
  const { name, keywords, bid, fund, status, town, radius } = req.body;
  const id = uuidv4();

  db.get('SELECT balance FROM account WHERE id = 1', (err, row) => {
    const currentBalance = row?.balance || 0;
    if (fund > currentBalance) {
      return res.status(400).json({ error: 'Niewystarczające środki' });
    }

    db.run(
      `INSERT INTO campaigns (id, name, keywords, bid, fund, status, town, radius)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, keywords, bid, fund, status, town, radius],
      err => {
        if (err) return res.status(500).json({ error: err.message });

        db.run(
          'UPDATE account SET balance = balance - ? WHERE id = 1',
          [fund],
          err2 => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.status(201).json({ success: true });
          }
        );
      }
    );
  });
});

app.put('/api/campaigns/:id', (req, res) => {
  const { name, keywords, bid, fund, status, town, radius } = req.body;
  db.run(
    `UPDATE campaigns SET name=?, keywords=?, bid=?, fund=?, status=?, town=?, radius=? WHERE id=?`,
    [name, keywords, bid, fund, status, town, radius, req.params.id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/campaigns/:id', (req, res) => {
  db.get('SELECT fund FROM campaigns WHERE id = ?', [req.params.id], (err, row) => {
    if (err || !row) return res.status(500).json({ error: err?.message || 'Not found' });

    const refund = row.fund;

    db.run('DELETE FROM campaigns WHERE id = ?', [req.params.id], err2 => {
      if (err2) return res.status(500).json({ error: err2.message });

      db.run('UPDATE account SET balance = balance + ? WHERE id = 1', [refund], err3 => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({ success: true });
      });
    });
  });
});

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`);
});