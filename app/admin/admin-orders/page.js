'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]) // ensure it's array
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        // กรณี API ส่ง array ตรง ๆ
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="flex min-h-screen bg-white text-black">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <AdminHeader title="Admin Orders" />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full max-w-5xl border border-gray-300 border-collapse text-sm text-center">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Movie</th>
                <th className="px-4 py-2 border">Theater</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Seats</th>
                <th className="px-4 py-2 border">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id}>
                  <td className="border py-2">{i + 1}</td>
                  <td className="border">{order.username}</td>
                  <td className="border">{order.movie_title}</td>
                  <td className="border">{order.theater}</td>
                  <td className="border">
                    {new Date(order.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="border">
                    {order.num_seats} {order.num_seats > 1 ? 'seats' : 'seat'}
                  </td>
                  <td className="border">฿ {order.total_price}</td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  )
}
