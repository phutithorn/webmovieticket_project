// /app/api/movies/[id]/route.js
import mysql from 'mysql2/promise'

export async function GET(req, { params }) {
  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true }
  })

  const [rows] = await connection.execute('SELECT * FROM movies WHERE id = ?', [params.id])
  await connection.end()

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: 'Movie not found' }), { status: 404 })
  }

  return Response.json(rows[0])
}
