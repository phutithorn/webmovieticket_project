// app/api/seats/[id]/route.js
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
  const [rows] = await connection.execute('SELECT * FROM seats WHERE id = ?', [params.id])
  await connection.end()

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: 'Seat not found' }), { status: 404 })
  }

  return new Response(JSON.stringify(rows[0]), { status: 200 })
}

export async function PUT(req, { params }) {
  const body = await req.json()
  const { label, seat_type, price, theater_id } = body

  const connection = await mysql.createConnection(dbConfig)
  await connection.execute(
    `UPDATE seats SET label = ?, seat_type = ?, price = ?, theater_id = ? WHERE id = ?`,
    [label, seat_type, price, theater_id, params.id]
  )
  await connection.end()

  return new Response(JSON.stringify({ message: 'Seat updated' }), { status: 200 })
}

export async function DELETE(req, { params }) {
  const connection = await mysql.createConnection(dbConfig)
  await connection.execute('DELETE FROM seats WHERE id = ?', [params.id])
  await connection.end()

  return new Response(JSON.stringify({ message: 'Seat deleted' }), { status: 200 })
}
