"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('Frontend')
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Client-side check just to be helpful
    if (!isLogin && password.length < 8) {
      setError('Password must be at least 8 characters.')
      setIsLoading(false)
      return
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
    const payload = isLogin ? { username, password } : { username, password, name, role }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      
      localStorage.setItem('nexus_user', JSON.stringify(data))
      
      if (data.role === 'Project Manager') {
        router.push('/')
      } else {
        router.push('/board')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className="p-8 text-center border-b border-zinc-100">
          <div className="flex justify-center mb-4">
            <Image src="/nexus-logo.png" alt="Nexus" width={150} height={50} style={{ width: 'auto', height: '40px' }} className="object-contain" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">
            {isLogin ? 'Sign in to TeamFlow' : 'Create an Account'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isLogin ? 'Enter your credentials to access the workspace.' : 'Join the Nexus engineering team.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">{error}</div>}
          
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-zinc-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]" placeholder="e.g. Alem" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-zinc-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]">
                  <option value="Frontend">Frontend Developer</option>
                  <option value="Backend">Backend Developer</option>
                  <option value="Design">Designer</option>
                  <option value="QA">QA Tester</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-zinc-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]" placeholder="e.g. alem12" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-zinc-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]" placeholder="••••••••" />
            {!isLogin && <p className="text-xs text-zinc-500 mt-1">Must be at least 8 characters long.</p>}
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#2a2f7a] text-white font-medium py-2.5 rounded-md hover:bg-[#1f235c] transition-colors disabled:opacity-50">
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>

          <div className="text-center mt-4">
            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-sm text-[#2a2f7a] hover:underline">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}