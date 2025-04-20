// app/api/movies/route.js
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
  const [rows] = await connection.execute('SELECT * FROM movies ORDER BY release_date ASC')
  await connection.end()
  return Response.json(rows)
}

export async function POST(req) {
  const body = await req.json()
  const values = [
    body.title, body.poster, body.category, body.duration,
    body.language, body.release_date, body.imdb_rating,
    body.director, body.cast, body.synopsis, body.status
  ]

  const connection = await mysql.createConnection(dbConfig)
  await connection.execute(`
    INSERT INTO movies 
    (title, poster, category, duration, language, release_date, imdb_rating, director, cast, synopsis, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, values)
  await connection.end()
  return new Response(JSON.stringify({ message: 'Movie added' }), { status: 201 })
}
