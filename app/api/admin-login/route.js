import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 })
    }

    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true },
    })

    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email])
    const user = rows[0]

    if (!user) {
      await connection.end()
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    if (user.role !== 'admin') {
      await connection.end()
      return new Response(JSON.stringify({ message: 'Not an admin' }), { status: 403 })
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      await connection.end()
      return new Response(JSON.stringify({ message: 'Invalid password' }), { status: 401 })
    }


    cookies().set('user_id', user.id.toString(), {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
    })
    
    cookies().set('role', user.role, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    })
    

    await connection.end()
    return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 })

  } catch (err) {
    console.error('Server error:', err)
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
