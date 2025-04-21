// app/api/showtimes/route.js
import mysql from 'mysql2/promise'
import dayjs from 'dayjs' // ✅ Make sure to import this

const dbConfig = {
  host: process.env.TIDB_HOST,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: { rejectUnauthorized: true }
}

export async function GET(req) {
  const url = new URL(req.url)
  const movie_id = url.searchParams.get('movie_id')
  const theater_id = url.searchParams.get('theater_id')
  const date = url.searchParams.get('date')
  const time = url.searchParams.get('time')

  const connection = await mysql.createConnection(dbConfig)

  let query = 'SELECT * FROM showtimes'
  let values = []

  if (movie_id && theater_id && date && time) {
    query += ' WHERE movie_id = ? AND theater_id = ? AND show_date = ? AND show_time LIKE ?'
    values = [movie_id, theater_id, date, `${time}%`] // % for partial match like "18:00%"
  }

  const [rows] = await connection.execute(query, values)
  await connection.end()
  return new Response(JSON.stringify(rows), { status: 200 })
}


export async function POST(req) {
  const { movie_id, theater_id, show_date, show_time } = await req.json()

  if (!movie_id || !theater_id || !show_date || !show_time) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  // 🚫 No formatting here — assume frontend sends correct format
  const connection = await mysql.createConnection(dbConfig)
  await connection.execute(
    `INSERT INTO showtimes (movie_id, theater_id, show_date, show_time) VALUES (?, ?, ?, ?)`,
    [movie_id, theater_id, show_date, show_time]
  )
  await connection.end()

  return new Response(JSON.stringify({ message: 'Showtime added' }), { status: 201 })
}

