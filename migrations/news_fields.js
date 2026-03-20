const Database = require('better-sqlite3');
const db = new Database('./database/site.db');

db.exec(`
  ALTER TABLE pages ADD COLUMN excerpt TEXT;
  ALTER TABLE pages ADD COLUMN featured_image TEXT;
  ALTER TABLE pages ADD COLUMN tags TEXT;
  ALTER TABLE pages ADD COLUMN views INTEGER DEFAULT 0;
`);

console.log('Dodano kolumny');
db.close();