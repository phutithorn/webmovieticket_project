'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [editUsername, setEditUsername] = useState('')
  const [editRole, setEditRole] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('admin')
  const [newEmail, setNewEmail] = useState('')
  const [editEmail, setEditEmail] = useState('')

  const handleAddUser = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          email: newEmail,
          role: newRole
        })
      })

      if (!res.ok) throw new Error('Failed to create user')

      await fetchUsers()
      setShowAddModal(false)
      setNewUsername('')
      setNewPassword('')
      setNewEmail('')
    } catch (err) {
      console.error('Add user failed:', err)
    }
  }


  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })

      if (!res.ok) throw new Error('Failed to delete user')

      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json()
        console.log('✅ Delete success:', data.message)
      }

      await fetchUsers()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setEditUsername(user.username)
    setEditRole(user.role)
    setEditEmail(user.email)
  }

  const handleSave = async () => {
    try {
      await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: editUsername, email: editEmail, role: editRole }),
      })
      setEditingUser(null)
      fetchUsers()
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-white text-black">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <AdminHeader title="Admin Users" />

        <input
          type="text"
          placeholder="Search by username"
          className="border p-2 rounded max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Admin
        </button>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="w-full border border-gray-300 border-collapse text-sm text-center">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id}>
                  <td className="border py-2">{i + 1}</td>
                  <td className="border">{user.username}</td>
                  <td className="border">{user.email}</td>
                  <td className="border">{user.role}</td>
                  <td className="border">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="border py-2 flex gap-2 justify-center">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2 text-sm">Username</label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2 text-sm">Role</label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingUser(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Admin</h2>

            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2 text-sm">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2 text-sm">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
