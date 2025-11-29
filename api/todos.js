import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query; // For /api/todos?id=... or handled via path if using dynamic routes

    try {
        if (method === 'GET') {
            const { rows } = await sql`SELECT * FROM todos ORDER BY position ASC, created_at DESC`;
            return res.status(200).json(rows);
        }

        if (method === 'POST') {
            const { text } = req.body;
            if (!text) return res.status(400).json({ error: 'Text is required' });

            // Get max position to append to bottom
            const { rows: maxPosRows } = await sql`SELECT MAX(position) as max_pos FROM todos`;
            const newPos = (maxPosRows[0].max_pos || 0) + 1000;

            const { rows } = await sql`
        INSERT INTO todos (text, position) VALUES (${text}, ${newPos})
        RETURNING *
      `;
            return res.status(201).json(rows[0]);
        }

        if (method === 'PUT') {
            // Batch update positions
            const { todos } = req.body;
            if (todos && Array.isArray(todos)) {
                // We'll do this in a simple loop for now, or construct a large CASE statement.
                // Loop is safer for small lists.
                for (let i = 0; i < todos.length; i++) {
                    await sql`UPDATE todos SET position = ${i * 1000} WHERE id = ${todos[i].id}`;
                }
                return res.status(200).json({ message: 'Order updated' });
            }
            return res.status(400).json({ error: 'Invalid body for PUT' });
        }

        if (method === 'PATCH') {
            // We expect ID to be passed in query or body. 
            // Vercel functions don't support dynamic routes like /api/todos/:id easily without configuration.
            // We will use query param ?id=... for simplicity or body.
            const todoId = req.query.id || req.body.id;
            const { completed, text } = req.body;

            if (!todoId) return res.status(400).json({ error: 'ID is required' });

            // Build dynamic update based on what fields are provided
            let updateQuery;
            if (text !== undefined && completed !== undefined) {
                updateQuery = sql`UPDATE todos SET text = ${text}, completed = ${completed} WHERE id = ${todoId} RETURNING *`;
            } else if (text !== undefined) {
                updateQuery = sql`UPDATE todos SET text = ${text} WHERE id = ${todoId} RETURNING *`;
            } else if (completed !== undefined) {
                updateQuery = sql`UPDATE todos SET completed = ${completed} WHERE id = ${todoId} RETURNING *`;
            } else {
                return res.status(400).json({ error: 'No fields to update' });
            }

            const { rows } = await updateQuery;
            return res.status(200).json(rows[0]);
        }

        if (method === 'DELETE') {
            const todoId = req.query.id || req.body.id;
            if (!todoId) return res.status(400).json({ error: 'ID is required' });

            await sql`DELETE FROM todos WHERE id = ${todoId}`;
            return res.status(200).json({ message: 'Deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
