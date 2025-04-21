'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminReportPage() {
  const [type, setType] = useState('all')
  const [date, setDate] = useState('')
  const [report, setReport] = useState([])

  useEffect(() => {
    fetchReport()
  }, [type, date])

  const fetchReport = async () => {
    let url = `/api/report?type=${type}`
    if (type !== 'all' && date) {
      url += `&date=${date}`
    }

    try {
      const res = await fetch(url)
      const data = await res.json()
      setReport(data || [])
    } catch (err) {
      console.error('Failed to fetch report:', err)
    }
  }

  const renderDateInput = () => {
    if (type === 'daily') {
      return (
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 rounded ml-2"
        />
      )
    } else if (type === 'monthly') {
      return (
        <input
          type="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 rounded ml-2"
        />
      )
    }
    return null
  }

  return (
    <div className="flex min-h-screen bg-white text-black">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <AdminHeader title="Admin Report" />

        <div className="mb-4">
          <label className="mr-2 font-medium">Filter by:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
          {renderDateInput()}
        </div>

        <table className="w-full max-w-3xl border border-gray-300 border-collapse text-sm text-center">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Movie name</th>
              <th className="px-4 py-2 border">Ticket sales</th>
              <th className="px-4 py-2 border">Total sales</th>
            </tr>
          </thead>
          <tbody>
            {report.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-gray-500">No data found</td>
              </tr>
            ) : (
              report.map((row, i) => (
                <tr key={row.movie_id}>
                  <td className="border py-2">{i + 1}</td>
                  <td className="border">{row.movie_title}</td>
                  <td className="border">{row.total_tickets}</td>
                  <td className="border">฿{row.total_sales?.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
