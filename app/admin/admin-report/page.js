'use client'

import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminReportPage() {
  const report = [
    { movie: 'Avengers: Endgame', tickets: 250, total: '฿25,000' },
    { movie: 'Oppenheimer', tickets: 180, total: '฿18,000' },
    { movie: 'Dune', tickets: 300, total: '฿30,000' },
    { movie: 'The Batman', tickets: 220, total: '฿22,000' },
    { movie: 'Joker', tickets: 160, total: '฿16,000' }
  ]

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <AdminSidebar />
      

      {/* Main Content */}
      <div className="flex-1 p-6">
        <AdminHeader title="Admin Report" />
              <table className="w-full max-w-3xl border border-gray-300 border-collapse text-sm text-center">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 border border-gray-300">#</th>
              <th className="px-4 py-2 border border-gray-300">Movie name</th>
              <th className="px-4 py-2 border border-gray-300">Ticket sales</th>
              <th className="px-4 py-2 border border-gray-300">Total sales</th>
            </tr>
          </thead>
          <tbody>
            {report.map((row, i) => (
              <tr key={i}>
                <td className="border border-gray-300 py-2">{i + 1}</td>
                <td className="border border-gray-300">{row.movie}</td>
                <td className="border border-gray-300">{row.tickets}</td>
                <td className="border border-gray-300">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
