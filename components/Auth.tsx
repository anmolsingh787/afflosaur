import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Naya account banane ke liye
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Signup successful! Check your email for verification.')
  }

  // Login karne ke liye
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else alert('Logged in successfully!')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Afflosaur Login / Signup</h2>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  )
}