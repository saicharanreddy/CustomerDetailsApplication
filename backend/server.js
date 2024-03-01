const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'customerdetails',
  password: '9390634342',
  port: 5432,
});

const app = express();

app.use(express.json());

app.get('/api/customers', async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'date';
    let orderBy;
    if (sortBy === 'date') {
      orderBy = 'created_at_date';
    } else {
      orderBy = 'created_at_time';
    }

    const sql = `
      SELECT sno, customer_name, age, phone, location,
             TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at_date,
             TO_CHAR(created_at, 'HH24:MI:SS') AS created_at_time
      FROM customers
      ORDER BY ${orderBy}
      LIMIT 20
    `;
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving customers:', error);
    res.status(500).send('Error retrieving customers');
  }
});

app.get('/api/customers/search', async (req, res) => {
  const { term } = req.query;
  try {
    const sql = `
      SELECT sno, customer_name, age, phone, location,
             TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at_date,
             TO_CHAR(created_at, 'HH24:MI:SS') AS created_at_time
      FROM customers
      WHERE customer_name ILIKE $1 OR location ILIKE $1
      ORDER BY created_at_date
    `;
    const result = await pool.query(sql, [`%${term}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).send('Error searching customers');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

