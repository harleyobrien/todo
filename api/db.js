import { createPool } from '@vercel/postgres';

export default async function handler(req, res) {
  // This is just a helper, but we can use it to test connection if needed
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });
  
  try {
    const client = await pool.connect();
    client.release();
    return pool;
  } catch (error) {
    console.error('DB Connection Error:', error);
    throw error;
  }
}

export const db = createPool({
  connectionString: process.env.POSTGRES_URL,
});
