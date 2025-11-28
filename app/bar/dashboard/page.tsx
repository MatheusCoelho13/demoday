'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/design-system/Card'
import Button from '@/components/design-system/Button'
import Badge from '@/components/design-system/Badge'

interface Order {
  id: string
  orderId: string
  time: string
  items: { name: string; quantity: number }[]
  total: number
  status: 'pending' | 'validated'
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'ORD-1234567890',
    time: '14:30',
    items: [
      { name: 'Cerveja Lata', quantity: 2 },
      { name: 'Água', quantity: 1 },
    ],
    total: 19.00,
    status: 'pending',
  },
  {
    id: '2',
    orderId: 'ORD-1234567891',
    time: '14:25',
    items: [
      { name: 'Refrigerante', quantity: 3 },
      { name: 'Energético', quantity: 1 },
    ],
    total: 25.00,
    status: 'pending',
  },
  {
    id: '3',
    orderId: 'ORD-1234567892',
    time: '14:20',
    items: [
      { name: 'Drink Pronto', quantity: 2 },
    ],
    total: 30.00,
    status: 'validated',
  },
]

export default function BarDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem('barLoggedIn')
    if (!loggedIn) {
      router.push('/bar/login')
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  const handleValidate = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? { ...order, status: 'validated' as const }
          : order
      )
    )
  }

  const pendingOrders = orders.filter((o) => o.status === 'pending')

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-graphite p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Painel de Pedidos</h1>
              <p className="text-gray-400">
                {pendingOrders.length} {pendingOrders.length === 1 ? 'pedido pendente' : 'pedidos pendentes'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/bar/scanner')}
                variant="secondary"
                size="medium"
              >
                📷 Scanner QR
              </Button>
              <Button
                onClick={() => router.push('/bar/settings')}
                variant="secondary"
                size="medium"
              >
                ⚙️ Configurações
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-400 text-xl">Nenhum pedido no momento</p>
            </Card>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-white">
                          Pedido {order.orderId}
                        </h2>
                        {order.status === 'validated' && (
                          <Badge variant="success">Validado</Badge>
                        )}
                        {order.status === 'pending' && (
                          <Badge variant="warning">Pendente</Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">Horário: {order.time}</p>
                    </div>
                    <p className="text-orange-vibrant font-bold text-xl">
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-dark-graphite rounded-lg p-4 mb-4">
                    <p className="text-gray-400 text-sm mb-2">Itens:</p>
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-white text-sm">
                          • {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {order.status === 'pending' && (
                    <Button
                      onClick={() => handleValidate(order.orderId)}
                      variant="primary"
                      size="medium"
                      fullWidth
                    >
                      Validar Retirada
                    </Button>
                  )}
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


