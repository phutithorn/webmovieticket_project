'use client'

import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import { useEffect, useState } from 'react'
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function AdminTheatersPage() {
  const [theaters, setTheaters] = useState([])
  const [seats, setSeats] = useState([])
  const [showtimes, setShowtimes] = useState([])
  const [seatData, setSeatData] = useState({ label: '', seat_type: 'Deluxe', price: '', theater_id: '' })
  const [showtimeData, setShowtimeData] = useState({ movie_id: '', theater_id: '', show_date: '', show_time: '' })


  const [newTheater, setNewTheater] = useState('')
  const [editId, setEditId] = useState(null)

  const fetchAll = async () => {
    const [tRes, sRes, shRes] = await Promise.all([
      fetch('/api/theaters'),
      fetch('/api/seats'),
      fetch('/api/showtimes'),
    ])
    setTheaters(await tRes.json())
    setSeats(await sRes.json())
    setShowtimes(await shRes.json())
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleCreate = async () => {
    if (!newTheater.trim()) return
    await fetch('/api/theaters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTheater }),
    })
    setNewTheater('')
    fetchAll()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this theater?')) return
    await fetch(`/api/theaters/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  return (
    <div className="flex min-h-screen bg-white text-black">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <AdminHeader title="Admin Theaters" />

        {/* Theaters Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Theaters</h2>

          <div className="mb-4 flex gap-2">
            <input
              className="border px-3 py-1 rounded"
              placeholder="New Theater Name"
              value={newTheater}
              onChange={(e) => setNewTheater(e.target.value)}
            />
            <button
              onClick={handleCreate}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              <PlusIcon className="w-4 h-4 inline-block mr-1" />
              Add
            </button>
          </div>

          <table className="w-full border border-gray-300 text-sm text-center">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((t, i) => (
                <tr key={t.id}>
                  <td className="border py-2">{i + 1}</td>
                  <td className="border">{t.name}</td>
                  <td className="border space-x-2">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      <TrashIcon className="h-4 w-4 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Seats Section */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Add Seat</h3>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              placeholder="Label (e.g. A1)"
              className="border px-3 py-1 rounded"
              value={seatData.label}
              onChange={(e) => setSeatData({ ...seatData, label: e.target.value })}
            />
            <select
              className="border px-3 py-1 rounded"
              value={seatData.seat_type}
              onChange={(e) => setSeatData({ ...seatData, seat_type: e.target.value })}
            >
              <option value="Deluxe">Deluxe</option>
              <option value="Premium">Premium</option>
              <option value="Suite">Suite</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              className="border px-3 py-1 rounded"
              value={seatData.price}
              onChange={(e) => setSeatData({ ...seatData, price: e.target.value })}
            />
            <select
              className="border px-3 py-1 rounded"
              value={seatData.theater_id}
              onChange={(e) => setSeatData({ ...seatData, theater_id: e.target.value })}
            >
              <option value="">Select Theater</option>
              {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button
              onClick={async () => {
                await fetch('/api/seats', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(seatData)
                })
                setSeatData({ label: '', seat_type: 'Deluxe', price: '', theater_id: '' })
                fetchAll()
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add Seat
            </button>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-2">Seats</h2>
          <table className="w-full border border-gray-300 text-sm text-center">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="border px-3 py-2">Label</th>
                <th className="border px-3 py-2">Type</th>
                <th className="border px-3 py-2">Price</th>
                <th className="border px-3 py-2">Theater</th>
              </tr>
            </thead>
            <tbody>
              {seats.map((s) => (
                <tr key={s.id}>
                  <td className="border">{s.label}</td>
                  <td className="border">{s.seat_type}</td>
                  <td className="border">{s.price} THB</td>
                  <td className="border">{theaters.find(t => t.id === s.theater_id)?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Showtimes Section */}

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Add Showtime</h3>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="number"
              placeholder="Movie ID"
              className="border px-3 py-1 rounded"
              value={showtimeData.movie_id}
              onChange={(e) => setShowtimeData({ ...showtimeData, movie_id: e.target.value })}
            />
            <select
              className="border px-3 py-1 rounded"
              value={showtimeData.theater_id}
              onChange={(e) => setShowtimeData({ ...showtimeData, theater_id: e.target.value })}
            >
              <option value="">Select Theater</option>
              {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input
              type="date"
              className="border px-3 py-1 rounded"
              value={showtimeData.show_date}
              onChange={(e) => setShowtimeData({ ...showtimeData, show_date: e.target.value })}
            />
            <input
              type="time"
              className="border px-3 py-1 rounded"
              value={showtimeData.show_time}
              onChange={(e) => setShowtimeData({ ...showtimeData, show_time: e.target.value })}
            />
            <button
              onClick={async () => {
                await fetch('/api/showtimes', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(showtimeData)
                })
                setShowtimeData({ movie_id: '', theater_id: '', show_date: '', show_time: '' })
                fetchAll()
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Showtime
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Showtimes</h2>
          <table className="w-full border border-gray-300 text-sm text-center">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="border px-3 py-2">Movie ID</th>
                <th className="border px-3 py-2">Theater</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map((sh) => (
                <tr key={sh.id}>
                  <td className="border">{sh.movie_id}</td>
                  <td className="border">{theaters.find(t => t.id === sh.theater_id)?.name || '-'}</td>
                  <td className="border">{sh.show_date}</td>
                  <td className="border">{sh.show_time.slice(0, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
