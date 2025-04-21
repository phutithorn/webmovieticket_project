// app/api/showtimes/[id]/route.js
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.TIDB_HOST,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: { rejectUnauthorized: true }
}

// GET /api/showtimes/[id]
export async function GET(req, { params }) {
  const connection = await mysql.createConnection(dbConfig)

  try {
    const [rows] = await connection.execute('SELECT * FROM showtimes WHERE id = ?', [params.id])
    await connection.end()

    if (rows.length === 0) {
      return Response.json({ error: 'Showtime not found' }, { status: 404 })
    }

    return Response.json(rows[0])
  } catch (err) {
    console.error('GET Showtime error:', err)
    await connection.end()
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/showtimes/[id]
export async function PUT(req, { params }) {
  const { movie_id, theater_id, show_date, show_time } = await req.json()
  const connection = await mysql.createConnection(dbConfig)

  try {
    await connection.execute(
      `UPDATE showtimes SET movie_id = ?, theater_id = ?, show_date = ?, show_time = ? WHERE id = ?`,
      [movie_id, theater_id, show_date, show_time, params.id]
    )
    await connection.end()

    return Response.json({ message: 'Showtime updated' })
  } catch (err) {
    console.error('PUT Showtime error:', err)
    await connection.end()
    return Response.json({ error: 'Failed to update showtime' }, { status: 500 })
  }
}

// DELETE /api/showtimes/[id]
export async function DELETE(req, { params }) {
  const connection = await mysql.createConnection(dbConfig)

  try {
    await connection.execute('DELETE FROM showtimes WHERE id = ?', [params.id])
    await connection.end()

    return Response.json({ message: 'Showtime deleted' })
  } catch (err) {
    console.error('DELETE Showtime error:', err)
    await connection.end()
    return Response.json({ error: 'Failed to delete showtime' }, { status: 500 })
  }
}