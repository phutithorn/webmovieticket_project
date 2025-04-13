'use client'

import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminTheatersPage() {
  const theaters = ['']

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
            <AdminHeader title="Admin Theaters" />

        

        {/* Theater Table */}
        <div className="mb-10">
          <h2 className="text-md font-semibold mb-2">Theater</h2>
          <table className="w-full max-w-md border border-gray-300 border-collapse text-sm text-center">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 border border-gray-300">#</th>
                <th className="px-4 py-2 border border-gray-300">Name</th>
                <th className="px-4 py-2 border border-gray-300">Status</th>
                <th className="px-4 py-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((name, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 py-2">{i + 1}</td>
                  <td className="border border-gray-300">{name}</td>
                  <td className="border border-gray-300">Status</td>
                  <td className="border border-gray-300">Action</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Seats Table */}
        <div>
          <h2 className="text-md font-semibold mb-2">Seats</h2>
          <table className="w-full max-w-3xl border border-gray-300 border-collapse text-sm text-center">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 border border-gray-300">#</th>
                <th className="px-4 py-2 border border-gray-300">Name</th>
                <th className="px-4 py-2 border border-gray-300">Type</th>
                <th className="px-4 py-2 border border-gray-300">Seats</th>
                <th className="px-4 py-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((name, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 py-2">{i + 1}</td>
                  <td className="border border-gray-300">{name}</td>
                  <td className="border border-gray-300">Type</td>
                  <td className="border border-gray-300">Seats</td>
                  <td className="border border-gray-300">Action</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
