'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/design-system/Card'
import Badge from '@/components/design-system/Badge'

interface Bar {
  id: string
  name: string
  demand: 'fast' | 'moderate' | 'busy'
  distance: string
}

const bars: Bar[] = [
  { id: '1', name: 'Bar Pista Norte', demand: 'fast', distance: '50m' },
  { id: '2', name: 'Bar Central', demand: 'moderate', distance: '120m' },
  { id: '3', name: 'Bar VIP', demand: 'busy', distance: '200m' },
  { id: '4', name: 'Bar Lateral', demand: 'fast', distance: '80m' },
]

export default function BarsPage() {
  const router = useRouter()

  const getDemandBadge = (demand: string) => {
    switch (demand) {
      case 'fast':
        return <Badge variant="success">Rápido</Badge>
      case 'moderate':
        return <Badge variant="warning">Moderado</Badge>
      case 'busy':
        return <Badge variant="danger">Cheio</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark-graphite p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Selecione o Bar</h1>
          <p className="text-gray-400">Escolha onde fazer seu pedido</p>
        </motion.div>

        <div className="space-y-4">
          {bars.map((bar, index) => (
            <motion.div
              key={bar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                onClick={() => router.push(`/menu/${bar.id}`)}
                hover
                className="p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {bar.name}
                    </h2>
                    <div className="flex items-center gap-3">
                      {getDemandBadge(bar.demand)}
                      <span className="text-gray-400 text-sm">
                        📍 {bar.distance}
                      </span>
                    </div>
                  </div>
                  <div className="text-orange-vibrant text-2xl">→</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}


