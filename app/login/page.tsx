'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Input from '@/components/design-system/Input'
import Button from '@/components/design-system/Button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Se já estiver logado, redirecionar
    const isLoggedIn = localStorage.getItem('userLoggedIn')
    if (isLoggedIn) {
      router.push('/')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { userApi } = await import('@/lib/api-client')
      const user = await userApi.login(email, password)

      if (!user) {
        setError('Email ou senha incorretos')
        setLoading(false)
        return
      }

      // Fazer login
      localStorage.setItem('userLoggedIn', 'true')
      localStorage.setItem('userId', user.id)
      localStorage.setItem('userName', user.name)
      localStorage.setItem('userBalance', (user.balance || 0).toString())

      setLoading(false)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
      setLoading(false)
    }
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
          <p className="text-gray-400">Fazer login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

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

          <div className="text-center space-y-3">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-orange-vibrant hover:underline">
                Criar conta
              </Link>
            </p>
            
            {/* Informações do usuário de exemplo */}
            <div className="mt-6 p-4 bg-dark-gray border border-orange-vibrant/30 rounded-lg">
              <p className="text-orange-vibrant text-sm font-semibold mb-2">
                💡 Usuário de Exemplo
              </p>
              <p className="text-gray-400 text-xs mb-1">
                Email: <span className="text-white">joao@exemplo.com</span>
              </p>
              <p className="text-gray-400 text-xs mb-1">
                Senha: <span className="text-white">123456</span>
              </p>
              <p className="text-gray-400 text-xs">
                Saldo: <span className="text-orange-vibrant font-bold">R$ 100,00</span>
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

