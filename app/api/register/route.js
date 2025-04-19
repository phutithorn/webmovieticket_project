import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

export async function POST(req) {
  try {
    const { email, username, password } = await req.json()
    if (!email || !username || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    }

    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    })

    const [existing] = await connection.execute(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    )

    if (existing.length > 0) {
        const existingUser = existing[0]
      
        if (existingUser.email === email) {
          return new Response(JSON.stringify({ error: 'email_taken' }), { status: 409 })
        }
      
        if (existingUser.username === username) {
          return new Response(JSON.stringify({ error: 'username_taken' }), { status: 409 })
        }
      
        return new Response(JSON.stringify({ error: 'conflict' }), { status: 409 })
      }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await connection.execute(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    )

    const userId = result.insertId
    await connection.end()

    // set cookie
    cookies().set('user_id', userId.toString(), {
      path: '/',
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return new Response(JSON.stringify({ message: 'Registered', userId }), { status: 201 })

  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
