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

export default function QRCodePage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string
  const [orderData, setOrderData] = useState<OrderData | null>(null)

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
    <div className="min-h-screen bg-dark-graphite p-4 md:p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-white mb-2">QR Code de Retirada</h1>
          <p className="text-gray-400">Apresente este código no balcão</p>
        </motion.div>

        <Card className="p-8">
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-xl mb-6 border-4 border-orange-vibrant">
              <QRCodeSVG
                value={orderData.orderId}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="w-full space-y-4 mb-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Código do Pedido</p>
                <p className="text-orange-vibrant font-bold text-2xl">{orderData.orderId}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Bar</p>
                <p className="text-white font-semibold text-lg">
                  {barNames[orderData.barId] || 'Bar'}
                </p>
              </div>
            </div>

            <div className="w-full bg-dark-graphite rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">Instruções de Retirada:</h3>
              <ol className="text-gray-400 text-sm space-y-2 text-left list-decimal list-inside">
                <li>Dirija-se ao balcão do {barNames[orderData.barId] || 'bar'}</li>
                <li>Apresente este QR Code para o atendente</li>
                <li>Aguarde a validação do código</li>
                <li>Retire seus itens</li>
              </ol>
            </div>

            <Button
              onClick={() => router.push(`/status/${orderData.orderId}`)}
              variant="secondary"
              size="medium"
              fullWidth
            >
              Voltar ao Status
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}


