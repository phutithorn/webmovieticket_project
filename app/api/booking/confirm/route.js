import mysql from 'mysql2/promise'
import { cookies } from 'next/headers'

export async function POST(req) {
  const { movieId, date, time, seatList, typeList, total, theaterId } = await req.json()
  const cookieStore = cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
  }

  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true }
  })

  try {
    await connection.beginTransaction()

    const [bookingResult] = await connection.execute(
      'INSERT INTO bookings (user_id, movie_id, theater, show_date, show_time, total_price) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, movieId, `Theater ${theaterId}`, date, time, total]
    )

    const bookingId = bookingResult.insertId

    const seatValues = seatList.map((label, i) => [
      bookingId,
      label,
      typeList[i],
      typeList[i] === 'Suite (Pair)' ? 1500 : typeList[i] === 'Premium' ? 540 : 320,
      theaterId,
      date,
      time
    ])

    await connection.query(
      'INSERT INTO booking_seats (booking_id, seat_label, seat_type, price, theater_id, show_date, show_time) VALUES ?',
      [seatValues]
    )

    await connection.commit()
    await connection.end()

    return new Response(JSON.stringify({ message: 'Booking saved!' }), { status: 200 })
  } catch (err) {
    await connection.rollback()
    console.error(err)
    return new Response(JSON.stringify({ message: 'Failed to save booking' }), { status: 500 })
  }
}
