// app/api/mytickets/[id]/route.js
import mysql from 'mysql2/promise'
import { cookies } from 'next/headers'

export async function GET(req, { params }) {
  const userId = cookies().get('user_id')?.value
  const bookingId = params.id

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    })

    const [bookings] = await connection.execute(
      `SELECT b.*, m.title AS movie_title, m.poster
       FROM bookings b
       JOIN movies m ON b.movie_id = m.id
       WHERE b.id = ? AND b.user_id = ?`,
      [bookingId, userId]
    )

    if (bookings.length === 0) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    }

    const booking = bookings[0]

    const [seats] = await connection.execute(
      `SELECT seat_label, seat_type, price
       FROM booking_seats
       WHERE booking_id = ?`,
      [bookingId]
    )

    await connection.end()

    return new Response(JSON.stringify({ ...booking, seats }), { status: 200 })
  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
