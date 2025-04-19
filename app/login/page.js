'use client'
import { useState } from 'react'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
  
      const data = await res.json()
  
      if (!res.ok) throw new Error(data.error)
  
      // success!
      window.location.href = '/home'
  
    } catch (err) {
      setError(err.message)
    }
  }
  


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#031C15] via-black to-[#0B3D29]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-black font-poppins"
      >
        <h2 className="text-2xl font-bold mb-8">Login to your account</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#00E676] text-white py-3 rounded-md font-semibold hover:bg-[#00C853] transition"
          >
            Login now
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-400">
          Don’t Have An Account?{' '}
          <a href="/register" className="text-[#00C853] font-medium hover:underline">
            Register Here
          </a>
        </p>
      </motion.div>
    </div>
  )
}
