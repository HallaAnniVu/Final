const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const DbService = require('./dbService'); // Ensure this matches the filename of your dbService file

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Read
app.get('/getAll', async (request, response) => {
  try {
    const db = DbService.getDbServiceInstance();
    const data = await db.getAllData();
    response.json({ data });
  } catch (err) {
    console.error('Error fetching data:', err);
    response.status(500).json({ error: 'Error fetching data' });
  }
});

// Insert
app.post('/insert', async (request, response) => {
  const { name } = request.body;
  try {
    const db = DbService.getDbServiceInstance();
    const success = await db.insertName(name);
    response.json({ success });
  } catch (err) {
    console.error('Error inserting data:', err);
    response.status(500).json({ error: 'Error inserting data' });
  }
});

// Update
app.patch('/update', async (request, response) => {
  const { id, name } = request.body;
  try {
    const db = DbService.getDbServiceInstance();
    const success = await db.updateNameById(id, name);
    response.json({ success });
  } catch (err) {
    console.error('Error updating data:', err);
    response.status(500).json({ error: 'Error updating data' });
  }
});

// Delete
app.delete('/delete/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const db = DbService.getDbServiceInstance();
    const success = await db.deleteRowById(id);
    response.json({ success });
  } catch (err) {
    console.error('Error deleting data:', err);
    response.status(500).json({ error: 'Error deleting data' });
  }
});

// Search
app.get('/search/:name', async (request, response) => {
  const { name } = request.params;
  try {
    const db = DbService.getDbServiceInstance();
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
