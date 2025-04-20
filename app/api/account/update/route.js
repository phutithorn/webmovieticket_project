import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

export async function POST(req) {
  const { username, email, oldPassword, newPassword } = await req.json()
  const userId = cookies().get('user_id')?.value

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true }
  })

  // Check duplicate username/email
  const [dupUser] = await connection.execute(
    'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
    [username, email, userId]
  )

  if (dupUser.length > 0) {
    await connection.end()
    return new Response(JSON.stringify({ message: '❌ Username or email already in use.' }), { status: 409 })
  }

  // Check old password if changing password
  let passwordHash = null
  if (newPassword) {
    const [user] = await connection.execute('SELECT password_hash FROM users WHERE id = ?', [userId])
    const match = await bcrypt.compare(oldPassword || '', user[0].password_hash)
    if (!match) {
      await connection.end()
      return new Response(JSON.stringify({ message: '❌ Incorrect current password.' }), { status: 403 })
    }

    passwordHash = await bcrypt.hash(newPassword, 10)
  }

  // Update user
  await connection.execute(
    'UPDATE users SET username = ?, email = ?, password_hash = COALESCE(?, password_hash) WHERE id = ?',
    [username, email, passwordHash, userId]
  )

  await connection.end()

  return new Response(JSON.stringify({ message: '✅ Account updated successfully.' }), { status: 200 })
}
