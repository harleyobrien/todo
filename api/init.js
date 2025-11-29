import { db } from './db.js';

export default async function handler(req, res) {
    try {
        await db.sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        return res.status(200).json({ message: 'Table created successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
