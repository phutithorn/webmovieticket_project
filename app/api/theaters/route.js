import mysql from 'mysql2/promise'

export async function GET() {
  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  })

  const [rows] = await connection.execute('SELECT * FROM theaters ORDER BY id ASC')
  await connection.end()
  return Response.json(rows)
}

export async function POST(req) {
  const { name, total_seats = 400 } = await req.json()

  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  })

  await connection.execute(
    `INSERT INTO theaters (name, total_seats) VALUES (?, ?)`,
    [name, total_seats]
  )

  await connection.end()
  return new Response(JSON.stringify({ message: 'Theater added' }), { status: 201 })
}
