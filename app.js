const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const dbService = require('./dbService');

app.use(cors());
app.use(express.json());

// Read All Records
app.get('/getAll', async (request, response) => {
  try {
    const db = dbService.getDbServiceInstance();
    const data = await db.getAllData();
    response.json({ data });
  } catch (err) {
    console.error('Error fetching data:', err);
    response.status(500).json({ error: 'Error fetching data' });
  }
});

// Read Record by ID
app.get('/getById/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const db = dbService.getDbServiceInstance();
    const data = await db.getDataById(id); // Ensure your dbService has this method
    response.json(data);
  } catch (err) {
    console.error('Error fetching data by ID:', err);
    response.status(500).json({ error: 'Error fetching data by ID' });
  }
});

// Insert New Record
app.post('/insert', async (request, response) => {
  const { name, program } = request.body;
  try {
    const db = dbService.getDbServiceInstance();
    const id = await db.insertData(name, program);
    response.json({ success: id > 0 });
  } catch (err) {
    console.error('Error inserting data:', err);
    response.status(500).json({ error: 'Error inserting data' });
  }
});

// Update Record
app.patch('/update', async (request, response) => {
  const { id, name, program } = request.body;
  try {
    const db = dbService.getDbServiceInstance();
    const success = await db.updateNameById(id, name, program);
    response.json({ success });
  } catch (err) {
    console.error('Error updating data:', err);
    response.status(500).json({ error: 'Error updating data' });
  }
});

// Delete Record
app.delete('/delete/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const db = dbService.getDbServiceInstance();
    const success = await db.deleteRowById(id);
    response.json({ success });
  } catch (err) {
    console.error('Error deleting data:', err);
    response.status(500).json({ error: 'Error deleting data' });
  }
});

// Search Records by Name
app.get('/search/:name', async (request, response) => {
  const { name } = request.params;
  try {
    const db = dbService.getDbServiceInstance();
    const data = await db.searchByName(name);
    response.json({ data });
  } catch (err) {
    console.error('Error searching data:', err);
    response.status(500).json({ error: 'Error searching data' });
  }
});

app.listen(process.env.PORT, () => {
  console.log('App is running on port', process.env.PORT);
});
