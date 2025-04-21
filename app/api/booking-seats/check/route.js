import mysql from 'mysql2/promise'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const movie_id = searchParams.get('movie_id')
  const theater_id = searchParams.get('theater_id')
  const show_date = searchParams.get('date')
  const show_time = searchParams.get('time')

  if (!movie_id || !theater_id || !show_date || !show_time) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 })
  }

  const conn = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true }
  })

  // Step 1: Get showtime_id
  const [showtimeRows] = await conn.execute(
    `SELECT id FROM showtimes WHERE movie_id = ? AND theater_id = ? AND show_date = ? AND show_time = ?`,
    [movie_id, theater_id, show_date, show_time]
  )

  if (showtimeRows.length === 0) {
    await conn.end()
    return new Response(JSON.stringify({ bookedSeats: [] }), { status: 200 }) // No showtime found = no seats booked
  }

  const showtime_id = showtimeRows[0].id

  // Step 2: Get booked seat labels by showtime_id
  const [rows] = await conn.execute(
    `SELECT seat_label FROM booking_seats WHERE showtime_id = ?`,
    [showtime_id]
  )

  await conn.end()

  const bookedSeats = rows.map(r => r.seat_label)

  return new Response(JSON.stringify({ bookedSeats }), { status: 200 })
}
