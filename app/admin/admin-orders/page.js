'use client'

import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminOrdersPage() {
  const orders = [
    { name: 'John', movie: 'Avengers: Endgame', info: '2 seats - 20:00' },
    { name: 'Jane', movie: 'Oppenheimer', info: '1 seat - 18:30' },
    { name: 'Mark', movie: 'Dune', info: '4 seats - 21:00' },
    { name: 'Lina', movie: 'The Batman', info: '3 seats - 19:45' }
  ]

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <AdminSidebar />
      

      {/* Main Content */}
      <div className="flex-1 p-6">
      <AdminHeader title="Admin Orders" />
        <table className="w-full max-w-2xl border border-gray-300 border-collapse text-sm text-center">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 border border-gray-300">#</th>
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Movie</th>
              <th className="px-4 py-2 border border-gray-300">Booking Info</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i}>
                <td className="border border-gray-300 py-2">{i + 1}</td>
                <td className="border border-gray-300">{order.name}</td>
                <td className="border border-gray-300">{order.movie}</td>
                <td className="border border-gray-300">{order.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
