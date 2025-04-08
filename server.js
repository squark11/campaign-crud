const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych PostgreSQL
const client = new Client({
  user: 'your-db-username',         // Użyj nazwy użytkownika bazy danych
  host: 'your-db-host',             // Użyj hosta bazy danych
  database: 'your-db-name',         // Użyj nazwy bazy danych
  password: 'your-db-password',     // Użyj hasła bazy danych
  port: 5432,                       // Domyślny port PostgreSQL
});

client.connect(err => {
  if (err) {
    console.error('Błąd połączenia z bazą danych', err.stack);
  } else {
    console.log('Połączono z bazą danych PostgreSQL');
  }
});

// Tworzenie tabel
client.query(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY,
    name TEXT,
    keywords TEXT,
    bid REAL,
    fund REAL,
    status TEXT,
    town TEXT,
    radius INTEGER
  );
`);

client.query(`
  CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    balance REAL
  );
`);

// CRUD kampanii
app.get('/api/campaigns', (req, res) => {
  client.query('SELECT * FROM campaigns', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.rows);
  });
});

app.get('/api/balance', (req, res) => {
  client.query('SELECT balance FROM account WHERE id = 1', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ balance: result.rows[0]?.balance || 0 });
  });
});

app.post('/api/campaigns', (req, res) => {
  const { name, keywords, bid, fund, status, town, radius } = req.body;
  const id = uuidv4();

  client.query('SELECT balance FROM account WHERE id = 1', (err, result) => {
    const currentBalance = result.rows[0]?.balance || 0;
    if (fund > currentBalance) {
      return res.status(400).json({ error: 'Niewystarczające środki' });
    }

    client.query(
      `INSERT INTO campaigns (id, name, keywords, bid, fund, status, town, radius)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, name, keywords, bid, fund, status, town, radius],
      err => {
        if (err) return res.status(500).json({ error: err.message });

        client.query(
          'UPDATE account SET balance = balance - $1 WHERE id = 1',
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

// Serwer nasłuchujący
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`);
});
