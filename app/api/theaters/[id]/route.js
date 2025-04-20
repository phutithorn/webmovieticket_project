import mysql from 'mysql2/promise'

export async function PUT(req, { params }) {
  const { name, total_seats } = await req.json()

  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  })

  await connection.execute(
    `UPDATE theaters SET name = ?, total_seats = ? WHERE id = ?`,
    [name, total_seats, params.id]
  )

  await connection.end()
  return new Response(JSON.stringify({ message: 'Theater updated' }), { status: 200 })
}

export async function DELETE(req, { params }) {
  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  })

  await connection.execute(`DELETE FROM theaters WHERE id = ?`, [params.id])
  await connection.end()

  return new Response(JSON.stringify({ message: 'Theater deleted' }), { status: 200 })
}
