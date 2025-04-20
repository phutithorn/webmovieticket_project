'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState({ username: '', email: '' })
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/me')
      const data = await res.json()
      setUser({ username: data.username, email: data.email })
    }
    fetchUser()
  }, [])

  const handleChange = async (e) => {
    e.preventDefault()

    if (newPassword && newPassword !== confirmPassword) {
      setMessage('❌ New password and confirm password do not match.')
      return
    }

    const res = await fetch('/api/account/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...user,
        oldPassword,
        newPassword
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setMessage(data.message || '❌ Failed to update.')
      return
    }

    setMessage('✅ Updated successfully!')
    router.push('/home')

  }

  return (
    <div className="min-h-screen bg-gradient-custom text-white flex items-center justify-center px-4 py-8">
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Account Settings</h1>

        <form onSubmit={handleChange} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Username</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full px-4 py-2 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
            />
          </div>

          <p className="text-xs text-gray-400">Leave password fields blank if you don't want to change password.</p>

          <button
            type="submit"
            className="w-full bg-[#00E676] text-black py-2 rounded-md font-semibold hover:bg-[#00C853] transition"
          >
            Save Changes
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-[#00E676]">{message}</p>}
      </div>

      <style jsx global>{`
        .bg-gradient-custom {
          background: radial-gradient(800px at bottom left, #0B3D29 0%, transparent 70%),
                      radial-gradient(1000px at top right, #04371F 0%, transparent 70%), #000;
        }
      `}</style>
    </div>
  )
}
