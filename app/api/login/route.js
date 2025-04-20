import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400 })
    }

    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    })

    const [rows] = await connection.execute(
      'SELECT id, role, password_hash FROM users WHERE email = ?',
      [email]
    )

    await connection.end()

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 })
    }

    const user = rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 })
    }

    // Set login cookie
    cookies().set('user_id', user.id.toString(), {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: true,
    })

    cookies().set('role', user.role, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
