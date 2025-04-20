// app/api/showtimes/[id]/route.js
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.TIDB_HOST,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: { rejectUnauthorized: true }
}

export async function GET(req, { params }) {
  const connection = await mysql.createConnection(dbConfig)
  const [rows] = await connection.execute('SELECT * FROM showtimes WHERE id = ?', [params.id])
  await connection.end()

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: 'Showtime not found' }), { status: 404 })
  }

  return new Response(JSON.stringify(rows[0]), { status: 200 })
}

export async function PUT(req, { params }) {
  const { movie_id, theater_id, show_date, show_time } = await req.json()

  const connection = await mysql.createConnection(dbConfig)
  await connection.execute(
    `UPDATE showtimes SET movie_id = ?, theater_id = ?, show_date = ?, show_time = ? WHERE id = ?`,
    [movie_id, theater_id, show_date, show_time, params.id]
  )
  await connection.end()

  return new Response(JSON.stringify({ message: 'Showtime updated' }), { status: 200 })
}

export async function DELETE(req, { params }) {
  const connection = await mysql.createConnection(dbConfig)
  await connection.execute('DELETE FROM showtimes WHERE id = ?', [params.id])
  await connection.end()

  return new Response(JSON.stringify({ message: 'Showtime deleted' }), { status: 200 })
}
