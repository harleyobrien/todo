import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    try {
        await sql`
      ALTER TABLE todos 
      ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
    `;
        return res.status(200).json({ message: 'Migration successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
