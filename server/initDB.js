import fs from 'fs';
import path from 'path';
import pool from './config/db.js'; 

const schema = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf8');

try {
  await pool.query(schema);
  console.log('✅ Database initialized.');
  process.exit(0);
} catch (err) {
  console.error('❌ Error initializing database:', err);
  process.exit(1);
}
