import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';

// ✅ Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Construct correct absolute path
const schemaPath = path.join(__dirname, 'schema.sql');

// ✅ Read and execute the schema
const schema = fs.readFileSync(schemaPath, 'utf8');

try {
  await pool.query(schema);
  console.log('✅ Database initialized.');
  process.exit(0);
} catch (err) {
  console.error('❌ Error initializing database:', err);
  process.exit(1);
}
