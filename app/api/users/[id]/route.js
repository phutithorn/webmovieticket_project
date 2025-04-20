import mysql from 'mysql2/promise'

export async function PUT(req, { params }) {
  const { id } = params
  const { username, email, role } = await req.json()

  try {
    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    })

    await connection.execute(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    )

    await connection.end()
    return Response.json({ message: 'User updated successfully' })
  } catch (err) {
    console.error('❌ Failed to update user:', err)
    return Response.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { id } = params

  try {
    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    })

    await connection.execute('DELETE FROM users WHERE id = ?', [id])
    await connection.end()

    return Response.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error('❌ Failed to delete user:', err)
    return Response.json({ error: 'Delete failed' }, { status: 500 })
  }
}
