import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    })

    const [rows] = await connection.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    )

    await connection.end()
    return Response.json(rows)
  } catch (err) {
    console.error('❌ Failed to load users:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req) {
  const { username, password, email, role } = await req.json()

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    })

    await connection.execute(
      'INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, role]
    )

    await connection.end()
    return Response.json({ message: 'User created successfully' })
  } catch (err) {
    console.error('❌ Error creating user:', err)
    return Response.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
