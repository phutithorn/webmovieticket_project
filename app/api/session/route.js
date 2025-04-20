// app/api/session/route.js
import { cookies } from 'next/headers'
import mysql from 'mysql2/promise'

export async function GET() {
  const cookieStore = cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return new Response(JSON.stringify({ loggedIn: false }), { status: 200 })
  }

  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true }
  })

  const [rows] = await connection.execute(
    'SELECT username FROM users WHERE id = ?',
    [userId]
  )

  await connection.end()

  if (!rows.length) {
    return new Response(JSON.stringify({ loggedIn: false }), { status: 200 })
  }

  return new Response(JSON.stringify({ loggedIn: true, username: rows[0].username }), {
    status: 200,
  })
}
