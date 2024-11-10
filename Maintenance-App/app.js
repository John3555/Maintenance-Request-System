// app.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const db = require('./models/database');
const upload = multer({ dest: 'public/uploads/' });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Tenant form route
app.get('/tenant-form', (req, res) => {
  res.render('tenant-form');
});

// FR1: Tenant - Submit Maintenance Request
app.post('/submit-request', upload.single('photo'), (req, res) => {
  const { apartment_number, area, description } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  const query = `INSERT INTO MaintenanceRequests (apartment_number, area, description, photo)
                 VALUES (?, ?, ?, ?)`;
  db.run(query, [apartment_number, area, description, photo], function (err) {
    if (err) return res.status(500).send('Error submitting request');
    res.redirect('/tenant-form?success=true');
  });
});

// FR2: Staff - Browse and Filter Maintenance Requests
app.get('/requests', (req, res) => {
  const { apartment_number, area, status, startDate, endDate } = req.query;
  let query = `SELECT * FROM MaintenanceRequests WHERE 1=1`;
  const params = [];

  if (apartment_number) {
    query += ` AND apartment_number = ?`;
    params.push(apartment_number);
  }
  if (area) {
    query += ` AND area = ?`;
    params.push(area);
  }
  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }
  if (startDate && endDate) {
    query += ` AND date_time BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).send('Error fetching requests');
    res.render('staff-dashboard', { requests: rows });
  });
});

// FR3: Staff - Update Request Status
app.post('/update-status', (req, res) => {
  const { request_id, status } = req.body;
  const query = `UPDATE MaintenanceRequests SET status = ? WHERE request_id = ?`;
  db.run(query, [status, request_id], (err) => {
    if (err) return res.status(500).send('Error updating status');
    res.redirect('/requests');
  });
});

// FR4: Manager - Add Tenant
app.post('/add-tenant', (req, res) => {
  const { name, phone_number, email, check_in_date, check_out_date, apartment_number } = req.body;
  const query = `INSERT INTO Tenants (name, phone_number, email, check_in_date, check_out_date, apartment_number)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [name, phone_number, email, check_in_date, check_out_date, apartment_number], function (err) {
    if (err) return res.status(500).send('Error adding tenant');
    res.redirect('/manager-dashboard');
  });
});

// FR4: Manager - Move Tenant
app.post('/move-tenant', (req, res) => {
  const { tenant_id, new_apartment_number } = req.body;
  const query = `UPDATE Tenants SET apartment_number = ? WHERE tenant_id = ?`;
  db.run(query, [new_apartment_number, tenant_id], (err) => {
    if (err) return res.status(500).send('Error moving tenant');
    res.redirect('/manager-dashboard');
  });
});

// FR4: Manager - Delete Tenant
app.post('/delete-tenant', (req, res) => {
  const { tenant_id } = req.body;
  const query = `DELETE FROM Tenants WHERE tenant_id = ?`;
  db.run(query, [tenant_id], (err) => {
    if (err) return res.status(500).send('Error deleting tenant');
    res.redirect('/manager-dashboard');
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
