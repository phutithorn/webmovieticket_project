import { cookies } from 'next/headers'
import mysql from 'mysql2/promise'

export async function GET() {
  const userId = cookies().get('user_id')?.value
  if (!userId) return Response.json({ message: 'Unauthorized' }, { status: 401 })

  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  })

  const [rows] = await connection.execute('SELECT username, email FROM users WHERE id = ?', [userId])
  await connection.end()

  return Response.json(rows[0] || {})
}
