'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/design-system/Card'
import Button from '@/components/design-system/Button'
import { QRCodeSVG } from 'qrcode.react'

interface OrderData {
  orderId: string
  barId: string
  paymentMethod: string
  timestamp: string
}

export default function StatusPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('currentOrder')
    if (saved) {
      setOrderData(JSON.parse(saved))
    }
  }, [])

  const barNames: Record<string, string> = {
    '1': 'Bar Pista Norte',
    '2': 'Bar Central',
    '3': 'Bar VIP',
    '4': 'Bar Lateral',
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-dark-graphite flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-graphite p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Status do Pedido</h1>
        </motion.div>

        <div className="space-y-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Pagamento Aprovado</h2>
                <p className="text-gray-400 text-sm">Seu pagamento foi confirmado</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-vibrant/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Aguardando Retirada</h2>
                <p className="text-gray-400 text-sm">Dirija-se ao balcão do bar</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-1">Código do Pedido</p>
              <p className="text-orange-vibrant font-bold text-xl">{orderData.orderId}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Bar</p>
              <p className="text-white font-semibold">
                {barNames[orderData.barId] || 'Bar'}
              </p>
            </div>
          </Card>
        </div>

        {showQR ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-white mb-4">QR Code para Retirada</h3>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCodeSVG
                    value={orderData.orderId}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-gray-400 text-sm text-center mb-4">
                  Apresente este QR Code no balcão para retirar seu pedido
                </p>
                <Button
                  onClick={() => router.push(`/qr-code/${orderData.orderId}`)}
                  variant="secondary"
                  size="medium"
                >
                  Ver Instruções de Retirada
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <Button
            onClick={() => setShowQR(true)}
            variant="secondary"
            size="large"
            fullWidth
          >
            Exibir QR Code
          </Button>
        )}
      </div>
    </div>
  )
}


