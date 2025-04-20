import mysql from 'mysql2/promise'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const theater_id = searchParams.get('theater_id')
  const show_date = searchParams.get('date')
  const show_time = searchParams.get('time')

  if (!theater_id || !show_date || !show_time) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 })
  }

  const conn = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true }
  })

  const [rows] = await conn.execute(
    'SELECT seat_label FROM booking_seats WHERE theater_id = ? AND show_date = ? AND show_time = ?',
    [theater_id, show_date, show_time]
  )

  await conn.end()
  const bookedSeats = rows.map(r => r.seat_label)

  return new Response(JSON.stringify({ bookedSeats }), { status: 200 })
}
