'use client'

import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import { useEffect, useState } from 'react'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function AdminTheatersPage() {
  const [theaters, setTheaters] = useState([])
  const [showtimes, setShowtimes] = useState([])
  const [movies, setMovies] = useState([])

  const [showtimeData, setShowtimeData] = useState({
    movie_id: '',
    theater_id: '',
    show_date: '',
    show_time: '',
  })

  const [editId, setEditId] = useState(null)
  const [newTheater, setNewTheater] = useState('')

  const fetchAll = async () => {
    const [tRes, shRes, mRes] = await Promise.all([
      fetch('/api/theaters'),
      fetch('/api/showtimes'),
      fetch('/api/movies'),
    ])
    setTheaters(await tRes.json())
    setMovies(await mRes.json())
    const fetchedShowtimes = await shRes.json()

    
    const sortedShowtimes = fetchedShowtimes.sort((a, b) => {
      const dateA = new Date(a.show_date)
      const dateB = new Date(b.show_date)
      return dateA - dateB
    })
    
    setShowtimes(sortedShowtimes) 
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleCreateTheater = async () => {
    if (!newTheater.trim()) return
    await fetch('/api/theaters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTheater } ),
    })
    setNewTheater('')
    fetchAll()
  }

  const handleDeleteTheater = async (id) => {
    if (!confirm('Delete this theater?')) return
    await fetch(`/api/theaters/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const handleDeleteShowtime = async (id) => {
    if (!confirm('Delete this showtime?')) return
    await fetch(`/api/adminshowtimes/${id}`, { method: 'DELETE' }) // ใช้ /adminshowtimes
    fetchAll()
  }

  const handleEditShowtime = (sh) => {
    setShowtimeData({
      movie_id: sh.movie_id,
      theater_id: sh.theater_id,
      show_date: sh.show_date, 
      show_time: sh.show_time,
      movie_title: sh.movie_title
    })
    setEditId(sh.id)
  }

  const handleSubmitShowtime = async () => {
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/adminshowtimes/${editId}` : '/api/adminshowtimes'
  
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(showtimeData),
    })
  
    setShowtimeData({ movie_id: '', theater_id: '', show_date: '', show_time: '' })
    setEditId(null)
    fetchAll()
  }

  return (
    <div className="flex min-h-screen bg-white text-black">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <AdminHeader title="Admin Theaters" />

        {/* Theater Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Theaters</h2>
          <div className="flex gap-2 mb-4">
            <input
              value={newTheater}
              onChange={(e) => setNewTheater(e.target.value)}
              placeholder="New Theater Name"
              className="border px-3 py-1 rounded"
            />
            <button
              onClick={handleCreateTheater}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              <PlusIcon className="w-4 h-4 inline-block mr-1" />
              Add
            </button>
          </div>

          <table className="w-full border border-gray-300 text-sm text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((t, i) => (
                <tr key={t.id}>
                  <td className="border">{i + 1}</td>
                  <td className="border">{t.name}</td>
                  <td className="border">
                    <button
                      onClick={() => handleDeleteTheater(t.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Showtime */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {editId ? 'Edit Showtime' : 'Add Showtime'}
          </h2>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              className="border px-3 py-1 rounded"
              value={showtimeData.movie_id}
              onChange={(e) =>
                setShowtimeData({ ...showtimeData, movie_id: e.target.value })
              }
            >
              <option value="">Select Movie</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>

            <select
              className="border px-3 py-1 rounded"
              value={showtimeData.theater_id}
              onChange={(e) =>
                setShowtimeData({ ...showtimeData, theater_id: e.target.value })
              }
            >
              <option value="">Select Theater</option>
              {theaters.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border px-3 py-1 rounded"
              value={showtimeData.show_date}
              onChange={(e) =>
                setShowtimeData({ ...showtimeData, show_date: e.target.value })
              }
            />
            <input
              type="time"
              className="border px-3 py-1 rounded"
              value={showtimeData.show_time}
              onChange={(e) =>
                setShowtimeData({ ...showtimeData, show_time: e.target.value })
              }
            />

            <button
              onClick={handleSubmitShowtime}
              className={`px-3 py-1 text-white rounded ${editId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {editId ? 'Update Showtime' : 'Add Showtime'}
            </button>

            {editId && (
              <button
                onClick={() => {
                  setEditId(null)
                  setShowtimeData({ movie_id: '', theater_id: '', show_date: '', show_time: '' })
                }}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Showtimes Table */}
        <h2 className="text-lg font-semibold mb-2">Showtimes</h2>
        <table className="w-full border border-gray-300 text-sm text-center">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2">Movie</th>
              <th className="border px-3 py-2">Theater</th>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Time</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((sh) => (
              <tr key={sh.id}>
                <td className="border">
                  {movies.find((m) => m.id === sh.movie_id)?.title || 'Unknown'}
                </td>
                <td className="border">
                  {theaters.find((t) => t.id === sh.theater_id)?.name || '-'}
                </td>
                <td className="border">
                  {new Date(sh.show_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="border">{sh.show_time.slice(0, 5)}</td>
                <td className="border space-x-2">
                  <button
                    onClick={() => handleEditShowtime(sh)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteShowtime(sh.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
