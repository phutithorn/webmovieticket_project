// app/api/movies/[id]/route.js
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
  const [rows] = await connection.execute('SELECT * FROM movies WHERE id = ?', [params.id])
  await connection.end()

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: 'Movie not found' }), { status: 404 })
  }

  return Response.json(rows[0])
}

export async function PUT(req, { params }) {
  const body = await req.json()
  const values = [
    body.title, body.poster, body.category, body.duration,
    body.language, body.release_date, body.imdb_rating,
    body.director, body.cast, body.synopsis, body.status,
    params.id
  ]

  const connection = await mysql.createConnection(dbConfig)
  await connection.execute(`
    UPDATE movies SET 
    title = ?, poster = ?, category = ?, duration = ?, language = ?, release_date = ?, 
    imdb_rating = ?, director = ?, cast = ?, synopsis = ?, status = ? 
    WHERE id = ?
  `, values)
  await connection.end()

  return new Response(JSON.stringify({ message: 'Movie updated' }), { status: 200 })
}

export async function DELETE(req, { params }) {
  const connection = await mysql.createConnection(dbConfig)
  await connection.execute('DELETE FROM movies WHERE id = ?', [params.id])
  await connection.end()

  return new Response(JSON.stringify({ message: 'Movie deleted' }), { status: 200 })
}
