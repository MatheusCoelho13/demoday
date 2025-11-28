'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/design-system/Card'
import QuantityButton from '@/components/design-system/QuantityButton'
import Button from '@/components/design-system/Button'

interface Product {
  id: string
  name: string
  price: number
  image: string
}

const products: Product[] = [
  { id: '1', name: 'Cerveja Lata', price: 8.00, image: '🍺' },
  { id: '2', name: 'Água', price: 3.00, image: '💧' },
  { id: '3', name: 'Refrigerante', price: 5.00, image: '🥤' },
  { id: '4', name: 'Energético', price: 10.00, image: '⚡' },
  { id: '5', name: 'Drink Pronto', price: 15.00, image: '🍹' },
  { id: '6', name: 'Suco', price: 6.00, image: '🧃' },
]

export default function CartPage() {
  const router = useRouter()
  const params = useParams()
  const barId = params.barId as string
  const [cart, setCart] = useState<Record<string, number>>({})

  useEffect(() => {
    // Simular carrinho do localStorage ou contexto
    const savedCart = localStorage.getItem(`cart_${barId}`)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [barId])

  const updateCart = (newCart: Record<string, number>) => {
    setCart(newCart)
    localStorage.setItem(`cart_${barId}`, JSON.stringify(newCart))
  }

  const addToCart = (productId: string) => {
    const newCart = {
      ...cart,
      [productId]: (cart[productId] || 0) + 1,
    }
    updateCart(newCart)
  }

  const removeFromCart = (productId: string) => {
    const newCart = { ...cart }
    if (newCart[productId] > 1) {
      newCart[productId] -= 1
    } else {
      delete newCart[productId]
    }
    updateCart(newCart)
  }

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, qty]) => {
      const product = products.find((p) => p.id === productId)
      return total + (product?.price || 0) * qty
    }, 0)
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  }

  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId)
    return { ...product, quantity }
  }).filter(Boolean) as (Product & { quantity: number })[]

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark-graphite flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-gray-400 text-xl mb-4">Carrinho vazio</p>
          <Button onClick={() => router.push(`/menu/${barId}`)}>
            Adicionar Itens
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-graphite p-4 md:p-6 pb-32">
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
          <h1 className="text-3xl font-bold text-white mb-2">Carrinho</h1>
        </motion.div>

        <div className="space-y-4 mb-6">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{item.image}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-orange-vibrant font-bold">
                      R$ {item.price.toFixed(2)} × {item.quantity} = R${' '}
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <QuantityButton
                    quantity={item.quantity}
                    onIncrease={() => addToCart(item.id)}
                    onDecrease={() => removeFromCart(item.id)}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-dark-gray border-t border-[#2A2A2A] p-4 shadow-2xl"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Total ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})</p>
              </div>
              <p className="text-orange-vibrant font-bold text-3xl">
                R$ {getTotalPrice().toFixed(2)}
              </p>
            </div>
            <Button
              onClick={() => router.push(`/payment/${barId}`)}
              variant="primary"
              size="large"
              fullWidth
            >
              Finalizar e Pagar
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


