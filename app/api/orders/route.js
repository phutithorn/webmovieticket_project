import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    })

    const [rows] = await connection.query(`
      SELECT 
        b.id,
        u.username,
        m.title AS movie_title,
        b.theater,
        b.created_at,
        b.total_price,
        COUNT(bs.id) AS num_seats
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN movies m ON b.movie_id = m.id
      LEFT JOIN booking_seats bs ON b.id = bs.booking_id
      GROUP BY 
        b.id, u.username, m.title, b.theater, b.created_at, b.total_price
      ORDER BY b.created_at DESC
    `)

    await connection.end()
    return Response.json(rows)
    
  } catch (err) {
    console.error('❌ Error fetching orders:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
