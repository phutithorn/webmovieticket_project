import mysql from 'mysql2/promise'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'all'
  const date = searchParams.get('date')

  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true }
  })

  let condition = ''
  let values = []

  if (type === 'daily' && date) {
    condition = 'WHERE DATE(b.created_at) = ?'
    values = [date]
  } else if (type === 'monthly' && date) {
    const [year, month] = date.split('-')
    condition = 'WHERE YEAR(b.created_at) = ? AND MONTH(b.created_at) = ?'
    values = [year, month]
  }
  // type === 'all' => ไม่มี WHERE

  const [rows] = await connection.query(
    `
    SELECT 
      m.id as movie_id,
      m.title AS movie_title,
      COUNT(bs.id) AS total_tickets,
      SUM(b.total_price) AS total_sales
    FROM bookings b
    JOIN movies m ON b.movie_id = m.id
    JOIN booking_seats bs ON b.id = bs.booking_id
    ${condition}
    GROUP BY m.id
    ORDER BY total_sales DESC
    `,
    values
  )

  await connection.end()
  return Response.json(rows)
}
