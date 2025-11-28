'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/design-system/Input'
import Button from '@/components/design-system/Button'

export default function BarLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simular login
    setTimeout(() => {
      localStorage.setItem('barLoggedIn', 'true')
      localStorage.setItem('barId', '1') // Simular bar ID
      setLoading(false)
      router.push('/bar/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-dark-graphite flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-vibrant mb-2">
            Flowfest
          </h1>
          <p className="text-gray-400">Painel do Vendedor</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant={loading ? 'disabled' : 'primary'}
            size="large"
            fullWidth
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}


