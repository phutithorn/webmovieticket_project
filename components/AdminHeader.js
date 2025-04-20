'use client'
import { useEffect, useState } from 'react'

export default function AdminHeader({ title }) {
  const [username, setUsername] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me') 
        const data = await res.json()
        if (res.ok) setUsername(data.username || '')
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }

    fetchUser()
  }, [])

  const initial = username.charAt(0).toUpperCase()

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-lg font-semibold text-black mb-4">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="bg-black text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4">
          {initial}
        </div>
        <span className="text-gray-800 font-medium mb-4">{username}</span>
        <div className="flex justify-end mb-4">
          <button
            onClick={async () => {
              await fetch('/api/logout', { method: 'POST' })
              window.location.href = '/admin/login'
            }}
            className="text-sm px-4 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
