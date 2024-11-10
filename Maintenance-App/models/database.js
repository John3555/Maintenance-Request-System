// models/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS MaintenanceRequests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    apartment_number TEXT NOT NULL,
    area TEXT NOT NULL,
    description TEXT NOT NULL,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    photo TEXT,
    status TEXT DEFAULT 'pending'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Tenants (
    tenant_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    apartment_number TEXT UNIQUE NOT NULL
  )`);
});

module.exports = db;
