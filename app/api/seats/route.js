// app/api/seats/route.js
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
  const [rows] = await connection.execute('SELECT * FROM seats ORDER BY theater_id, label')
  await connection.end()
  return new Response(JSON.stringify(rows), { status: 200 })
}

export async function POST(req) {
  const body = await req.json()
  const { label, seat_type, price, theater_id } = body

  if (!label || !seat_type || !price || !theater_id) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }

  const connection = await mysql.createConnection(dbConfig)
  await connection.execute(
    `INSERT INTO seats (label, seat_type, price, theater_id) VALUES (?, ?, ?, ?)`,
    [label, seat_type, price, theater_id]
  )
  await connection.end()

  return new Response(JSON.stringify({ message: 'Seat created' }), { status: 201 })
}
