'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/design-system/Button'
import Card from '@/components/design-system/Card'

export default function WelcomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn')
    const name = localStorage.getItem('userName')
    const userBalance = localStorage.getItem('userBalance')

    if (loggedIn === 'true') {
      setIsLoggedIn(true)
      setUserName(name || '')
      setBalance(parseFloat(userBalance || '0'))
      
      // Atualizar saldo do servidor
      const userId = localStorage.getItem('userId')
      if (userId) {
        import('@/lib/api-client').then(({ userApi }) => {
          userApi.getById(userId).then(user => {
            if (user) {
              setBalance(user.balance)
              localStorage.setItem('userBalance', user.balance.toString())
            }
          })
        })
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userBalance')
    setIsLoggedIn(false)
    setUserName('')
    setBalance(0)
  }

  return (
    <div className="min-h-screen bg-dark-graphite flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold text-orange-vibrant mb-4">
            Flowfest
          </h1>
          <div className="w-24 h-1 bg-orange-vibrant mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300 mb-8 font-light"
        >
          Peça, pague e retire sem fila.
        </motion.p>

        {/* Card de Saldo - Mostra apenas se estiver logado */}
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-gray-400 text-sm">Olá, {userName}</p>
                  <h2 className="text-2xl font-bold text-white mt-1">Saldo</h2>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Sair
                </button>
              </div>
              <p className="text-3xl font-bold text-orange-vibrant">
                R$ {balance.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Deposite antecipadamente para agilizar seus pedidos
              </p>
            </Card>
          </motion.div>
        )}

        {/* Botões de Login/Cadastro - Mostra apenas se NÃO estiver logado */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 mb-6"
          >
            <Button
              onClick={() => router.push('/login')}
              variant="primary"
              size="large"
              fullWidth
            >
              Fazer Login
            </Button>
            <Button
              onClick={() => router.push('/register')}
              variant="secondary"
              size="large"
              fullWidth
            >
              Criar Conta
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => router.push('/bars')}
            variant="primary"
            size="large"
            fullWidth
            className="shadow-lg shadow-orange-vibrant/30"
          >
            {isLoggedIn ? 'Ver Bares' : 'Continuar sem login'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}


