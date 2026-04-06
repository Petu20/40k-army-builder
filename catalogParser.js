import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';
import { fileURLToPath } from 'url';
import connection from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogDir = path.join(__dirname, 'Orks & Tyranids catalog');

export const parseArmies = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(catalogDir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const catFiles = files.filter(f => f.endsWith('.cat'));
      let processed = 0;

      if (catFiles.length === 0) {
        resolve({ message: 'No .cat files found' });
        return;
      }

      catFiles.forEach(file => {
        const filePath = path.join(catalogDir, file);
        const armyName = file.replace('.cat', '');

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
            return;
          }

          parseString(data, (err, result) => {
            if (err) {
              reject(err);
              return;
            }

            // First, insert or get the army
            connection.query(
              'INSERT INTO armies (name) VALUES (?) ON DUPLICATE KEY UPDATE name=?',
              [armyName, armyName],
              (err, armyResult) => {
                if (err) {
                  console.error('Error inserting army:', err);
                  return;
                }

                // Parse and insert units from XML
                if (result.catalogue && result.catalogue.entries) {
                  const entries = result.catalogue.entries[0].entry || [];
                  let unitCount = 0;

                  entries.forEach(entry => {
                    const unitName = entry.$.name;
                    const points = entry.$.points || 0;

                    connection.query(
                      'INSERT INTO units (army_id, name, points) VALUES ((SELECT id FROM armies WHERE name=?), ?, ?) ON DUPLICATE KEY UPDATE points=?',
                      [armyName, unitName, points, points],
                      (err) => {
                        if (err) console.error('Error inserting unit:', err);
                        unitCount++;
                        if (unitCount === entries.length) {
                          processed++;
                          if (processed === catFiles.length) {
                            resolve({ message: `Parsed ${processed} catalogs successfully` });
                          }
                        }
                      }
                    );
                  });
                } else {
                  processed++;
                  if (processed === catFiles.length) {
                    resolve({ message: `Parsed ${processed} catalogs (no entries found)` });
                  }
                }
              }
            );
          });
        });
      });
    });
  });
};