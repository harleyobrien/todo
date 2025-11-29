import { db } from './db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query; // For /api/todos?id=... or handled via path if using dynamic routes

    try {
        if (method === 'GET') {
            const { rows } = await db.sql`SELECT * FROM todos ORDER BY created_at DESC`;
            return res.status(200).json(rows);
        }

        if (method === 'POST') {
            const { text } = req.body;
            if (!text) return res.status(400).json({ error: 'Text is required' });

            const { rows } = await db.sql`
        INSERT INTO todos (text) VALUES (${text})
        RETURNING *
      `;
            return res.status(201).json(rows[0]);
        }

        if (method === 'PATCH') {
            // We expect ID to be passed in query or body. 
            // Vercel functions don't support dynamic routes like /api/todos/:id easily without configuration.
            // We will use query param ?id=... for simplicity or body.
            const todoId = req.query.id || req.body.id;
            const { completed } = req.body;

            if (!todoId) return res.status(400).json({ error: 'ID is required' });

            const { rows } = await db.sql`
            UPDATE todos SET completed = ${completed} WHERE id = ${todoId} RETURNING *
        `;
            return res.status(200).json(rows[0]);
        }

        if (method === 'DELETE') {
            const todoId = req.query.id || req.body.id;
            if (!todoId) return res.status(400).json({ error: 'ID is required' });

            await db.sql`DELETE FROM todos WHERE id = ${todoId}`;
            return res.status(200).json({ message: 'Deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
