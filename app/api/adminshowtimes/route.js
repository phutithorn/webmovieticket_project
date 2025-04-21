// app/api/showtimes/route.js
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.TIDB_HOST,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: { rejectUnauthorized: true }
}

export async function GET() {
  const connection = await mysql.createConnection(dbConfig)
  const [rows] = await connection.execute(
    `
    SELECT 
      s.id,
      s.movie_id,
      m.title AS movie_title,
      s.theater_id,
      s.show_date,
      s.show_time,
      s.created_at
    FROM showtimes s
    JOIN movies m ON s.movie_id = m.id
    ORDER BY s.show_date, s.show_time
  `
  )
  await connection.end()
  return new Response(JSON.stringify(rows), { status: 200 })
}

export async function POST(req) {
  const { movie_id, theater_id, show_date, show_time } = await req.json()

  if (!movie_id || !theater_id || !show_date || !show_time) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  const connection = await mysql.createConnection(dbConfig)
  await connection.execute(
    `INSERT INTO showtimes (movie_id, theater_id, show_date, show_time) VALUES (?, ?, ?, ?)`,
    [movie_id, theater_id, show_date, show_time]
  )
  await connection.end()

  return new Response(JSON.stringify({ message: 'Showtime added' }), { status: 201 })
}