import connection from './db.js';

// Initialize database tables
const initDatabase = () => {
  const createArmiesTable = `
    CREATE TABLE IF NOT EXISTS armies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    )
  `;

  const createUnitsTable = `
    CREATE TABLE IF NOT EXISTS units (
      id INT AUTO_INCREMENT PRIMARY KEY,
      army_id INT NOT NULL,
      name VARCHAR(200) NOT NULL,
      points INT DEFAULT 0,
      FOREIGN KEY (army_id) REFERENCES armies(id) ON DELETE CASCADE
    )
  `;

  connection.query(createArmiesTable, (err) => {
    if (err) {
      console.error('Error creating armies table:', err);
      return;
    }
    console.log('Armies table ready');

    connection.query(createUnitsTable, (err) => {
      if (err) {
        console.error('Error creating units table:', err);
        return;
      }
      console.log('Units table ready');
      console.log('Database initialized successfully');
      connection.end();
    });
  });
};

initDatabase();