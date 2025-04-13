'use client'

import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminUsersPage() {
  const users = ['user1', 'user2', 'user3', 'user4', 'user5']

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
                <AdminHeader title="Admin Users" />

        {/* Users Table */}
        <table className="w-full max-w-md border border-gray-300 border-collapse text-sm text-center">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 border border-gray-300">#</th>
              <th className="px-4 py-2 border border-gray-300">Username</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((username, i) => (
              <tr key={i}>
                <td className="border border-gray-300 py-2">{i + 1}</td>
                <td className="border border-gray-300">{username}</td>
                <td className="border border-gray-300">Action</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
