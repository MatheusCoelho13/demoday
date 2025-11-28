'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Input from '@/components/design-system/Input'
import Button from '@/components/design-system/Button'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const { userApi } = await import('@/lib/api-client')
      const newUser = await userApi.create(
        formData.name,
        formData.email,
        formData.password
      )

      if (!newUser) {
        setError('Erro ao criar conta')
        setLoading(false)
        return
      }

      // Fazer login automático
      localStorage.setItem('userLoggedIn', 'true')
      localStorage.setItem('userId', newUser.id)
      localStorage.setItem('userName', newUser.name)
      localStorage.setItem('userBalance', (newUser.balance || 0).toString())

      setLoading(false)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
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
          <p className="text-gray-400">Criar conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            type="text"
            name="name"
            label="Nome completo"
            placeholder="Seu nome"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="password"
            label="Senha"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirmar senha"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant={loading ? 'disabled' : 'primary'}
            size="large"
            fullWidth
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-orange-vibrant hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

