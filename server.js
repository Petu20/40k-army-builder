import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connection from './db.js';
import { parseArmies } from './catalogParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Use 3001 so React can use 3000

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// API Routes

// Get all armies
app.get('/api/armies', (req, res) => {
  connection.query('SELECT * FROM armies', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(results);
  });
});

// Get units for a specific army
app.get('/api/armies/:armyId/units', (req, res) => {
  const { armyId } = req.params;
  connection.query(
    'SELECT * FROM units WHERE army_id = ?',
    [armyId],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      res.json(results);
    }
  );
});

// Parse catalog files and populate database
app.post('/api/parse-catalogs', async (req, res) => {
  try {
    const result = await parseArmies();
    res.json(result);
  } catch (err) {
    console.error('Error parsing catalogs:', err);
    res.status(500).json({ error: 'Failed to parse catalogs' });
  }
});

// Serve React app for all other routes (catch-all)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
