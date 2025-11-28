'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/design-system/Card'
import Button from '@/components/design-system/Button'
import { userApi, orderApi } from '@/lib/api-client'

interface Product {
  id: string
  name: string
  price: number
}

const products: Product[] = [
  { id: '1', name: 'Cerveja Lata', price: 8.00 },
  { id: '2', name: 'Água', price: 3.00 },
  { id: '3', name: 'Refrigerante', price: 5.00 },
  { id: '4', name: 'Energético', price: 10.00 },
  { id: '5', name: 'Drink Pronto', price: 15.00 },
  { id: '6', name: 'Suco', price: 6.00 },
]

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const barId = params.barId as string
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'balance' | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Verificar se está logado
    const loggedIn = localStorage.getItem('userLoggedIn')
    const balance = localStorage.getItem('userBalance')
    
    if (loggedIn === 'true' && balance) {
      setIsLoggedIn(true)
      setUserBalance(parseFloat(balance))
    }

    // Calcular total do carrinho
    const savedCart = localStorage.getItem(`cart_${barId}`)
    if (savedCart) {
      const cart = JSON.parse(savedCart)
      const cartTotal = Object.entries(cart).reduce((sum, [productId, qty]) => {
        const product = products.find((p) => p.id === productId)
        return sum + (product?.price || 0) * (qty as number)
      }, 0)
      setTotal(cartTotal)
    }
  }, [barId])

  const handlePayment = async (method: 'pix' | 'card' | 'balance') => {
    setPaymentMethod(method)
    setPaymentStatus('processing')

    // Se for pagamento com saldo, verificar saldo primeiro
    if (method === 'balance') {
      const userId = localStorage.getItem('userId')
      if (!userId || userBalance < total) {
        setPaymentStatus('error')
        return
      }
    }

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000))

    let success = true
    let orderId = `ORD-${Date.now()}`

    // Se for pagamento com saldo, debitar do saldo
    if (method === 'balance') {
      const userId = localStorage.getItem('userId')
      if (userId) {
        try {
          const newBalance = await userApi.updateBalance(userId, total, 'subtract')
          if (newBalance !== null) {
            localStorage.setItem('userBalance', newBalance.toString())
            setUserBalance(newBalance)
            success = true
          } else {
            success = false
          }
        } catch (err) {
          success = false
        }
      } else {
        success = false
      }
    } else {
      // Para PIX e Cartão, simular 90% de chance de sucesso
      success = Math.random() > 0.1
    }

    if (success) {
      const userId = localStorage.getItem('userId') || 'guest'
      
      // Salvar pedido no banco de dados
      const savedCart = localStorage.getItem(`cart_${barId}`)
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        const orderItems = Object.entries(cart).map(([productId, qty]) => {
          const product = products.find((p) => p.id === productId)
          return {
            productId,
            name: product?.name || '',
            price: product?.price || 0,
            quantity: qty as number,
          }
        })

        try {
          const newOrder = await orderApi.create({
            userId,
            barId,
            items: orderItems,
            total,
            paymentMethod: method,
            status: 'paid',
          })

          if (newOrder) {
            orderId = newOrder.orderId
            localStorage.setItem('currentOrder', JSON.stringify({
              orderId: newOrder.orderId,
              barId,
              paymentMethod: method,
              timestamp: newOrder.createdAt,
            }))
          }
        } catch (err) {
          console.error('Erro ao salvar pedido:', err)
        }
      }

      // Limpar carrinho
      localStorage.removeItem(`cart_${barId}`)
      
      setPaymentStatus('success')
      
      setTimeout(() => {
        router.push(`/status/${orderId}`)
      }, 2000)
    } else {
      setPaymentStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-dark-graphite p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="text-orange-vibrant mb-4 flex items-center gap-2"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Pagamento</h1>
          <p className="text-gray-400">Escolha a forma de pagamento</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {paymentStatus === 'idle' && (
            <motion.div
              key="payment-methods"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Opção de pagamento com saldo - apenas se estiver logado */}
              {isLoggedIn && (
                <Card
                  onClick={() => {
                    if (userBalance >= total) {
                      handlePayment('balance')
                    }
                  }}
                  hover={userBalance >= total}
                  className={`p-6 cursor-pointer ${userBalance < total ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">💰</div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Saldo</h3>
                        <p className="text-gray-400 text-sm">
                          {userBalance >= total 
                            ? `Saldo disponível: R$ ${userBalance.toFixed(2).replace('.', ',')}`
                            : `Saldo insuficiente (R$ ${userBalance.toFixed(2).replace('.', ',')})`
                          }
                        </p>
                      </div>
                    </div>
                    <div className={`text-2xl ${userBalance >= total ? 'text-orange-vibrant' : 'text-gray-500'}`}>
                      {userBalance >= total ? '→' : '✕'}
                    </div>
                  </div>
                </Card>
              )}

              <Card
                onClick={() => handlePayment('pix')}
                hover
                className="p-6 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📱</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">PIX</h3>
                      <p className="text-gray-400 text-sm">Pagamento instantâneo</p>
                    </div>
                  </div>
                  <div className="text-orange-vibrant text-2xl">→</div>
                </div>
              </Card>

              <Card
                onClick={() => handlePayment('card')}
                hover
                className="p-6 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">💳</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Cartão</h3>
                      <p className="text-gray-400 text-sm">Crédito ou débito</p>
                    </div>
                  </div>
                  <div className="text-orange-vibrant text-2xl">→</div>
                </div>
              </Card>
            </motion.div>
          )}

          {paymentStatus === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-4 border-orange-vibrant border-t-transparent rounded-full mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-white mb-2">
                Processando pagamento...
              </h2>
              <p className="text-gray-400">
                Aguarde enquanto processamos seu {paymentMethod === 'pix' ? 'PIX' : paymentMethod === 'card' ? 'cartão' : 'saldo'}
              </p>
            </motion.div>
          )}

          {paymentStatus === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-5xl">✓</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Pagamento Confirmado!
              </h2>
              <p className="text-gray-400">
                Redirecionando para o QR Code...
              </p>
            </motion.div>
          )}

          {paymentStatus === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-5xl">✕</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Erro no Pagamento
              </h2>
              <p className="text-gray-400 mb-6">
                {paymentMethod === 'balance' 
                  ? 'Saldo insuficiente ou erro ao processar. Verifique seu saldo e tente novamente.'
                  : 'Não foi possível processar seu pagamento. Tente novamente.'
                }
              </p>
              <Button
                onClick={() => {
                  setPaymentStatus('idle')
                  setPaymentMethod(null)
                }}
                variant="primary"
                size="large"
                fullWidth
              >
                Tentar Novamente
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


