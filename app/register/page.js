'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const isMatch = password === confirm || confirm === ''

  const containerVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  }

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState(null)
  const [errorField, setErrorField] = useState(null)
  const [formError, setFormError] = useState(null)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setErrorField(null)
    setFormError(null)

    if (!email || !username || !password || !confirm) {
      setFormError('Please fill in all required fields.')
      return
    }

    if (!isMatch) return

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (data.error === 'email_taken') setErrorField('email')
        else if (data.error === 'username_taken') setErrorField('username')
        else setErrorField('general')

        throw new Error(data.error)
      }


      setMessage('Account created! Redirecting...')
      setTimeout(() => window.location.href = '/home', 1500)

    } catch (err) {
      setMessage(err.message)
    }
  }




  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative">
      <div className="relative flex flex-col px-10 py-10 ">
        <motion.img
          src="/incinema.jpg"
          alt="Background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="z-10"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={40}
          />
        </motion.div>
        <motion.div
          className="relative z-10 text-[45px] leading-[1.2] italic font-light text-gradient mt-auto"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          <p>Welcome to Sakon Cinema</p>
          <p>Your movie, your way</p>
          <p>Best seats in Thailand</p>
          <p>Join us today</p>
          <p>Let the show begin!</p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-black bg-white rounded-xl shadow-lg p-10">
          <h2 className="text-2xl font-bold mb-8">Create an account</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errorField === 'email' && (
                <p className="text-sm text-red-500 mt-1">This email is already registered</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              {errorField === 'username' && (
                <p className="text-sm text-red-500 mt-1">This username is already taken</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm your password</label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 ${isMatch ? 'focus:ring-[#00E676]' : 'border-red-500 focus:ring-red-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {!isMatch && <p className="text-sm text-red-500 mt-1">Passwords do not match</p>}
            </div>
            {formError && (
              <p className="text-sm text-red-500 text-center">{formError}</p>
            )}

            <button
              type="submit"
              disabled={!isMatch}
              className="w-full bg-[#00E676] text-white py-3 rounded-md font-semibold hover:bg-[#00C853] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-400">
            Already Have An Account ?{' '}
            <a href="/login" className="text-[#00C853] font-medium hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
