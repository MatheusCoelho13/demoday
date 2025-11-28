'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/design-system/Input'
import Button from '@/components/design-system/Button'
import Card from '@/components/design-system/Card'

interface BarSettings {
  name: string
  status: 'open' | 'closed'
  items: { id: string; name: string; price: number }[]
}

const defaultItems = [
  { id: '1', name: 'Cerveja Lata', price: 8.00 },
  { id: '2', name: 'Água', price: 3.00 },
  { id: '3', name: 'Refrigerante', price: 5.00 },
  { id: '4', name: 'Energético', price: 10.00 },
  { id: '5', name: 'Drink Pronto', price: 15.00 },
  { id: '6', name: 'Suco', price: 6.00 },
]

export default function BarSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<BarSettings>({
    name: 'Bar Pista Norte',
    status: 'open',
    items: defaultItems,
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem('barLoggedIn')
    if (!loggedIn) {
      router.push('/bar/login')
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  const handleUpdateItem = (id: string, field: 'name' | 'price', value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  const handleSave = () => {
    // Simular salvamento
    alert('Configurações salvas com sucesso!')
  }

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
          <button
            onClick={() => router.back()}
            className="text-orange-vibrant mb-4 flex items-center gap-2"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Configurações do Bar</h1>
          <p className="text-gray-400">Gerencie as informações do seu bar</p>
        </motion.div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Informações Básicas</h2>
            <div className="space-y-4">
              <Input
                label="Nome do Bar"
                value={settings.name}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setSettings((prev) => ({ ...prev, status: 'open' }))
                    }
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      settings.status === 'open'
                        ? 'bg-green-500 text-white'
                        : 'bg-dark-gray text-gray-400'
                    }`}
                  >
                    Aberto
                  </button>
                  <button
                    onClick={() =>
                      setSettings((prev) => ({ ...prev, status: 'closed' }))
                    }
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      settings.status === 'closed'
                        ? 'bg-red-500 text-white'
                        : 'bg-dark-gray text-gray-400'
                    }`}
                  >
                    Fechado
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Itens e Preços</h2>
            <div className="space-y-4">
              {settings.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-end bg-dark-graphite p-4 rounded-lg"
                >
                  <div className="flex-1">
                    <Input
                      label="Nome do Item"
                      value={item.name}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'name', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      label="Preço (R$)"
                      type="number"
                      value={item.price.toString()}
                      onChange={(e) =>
                        handleUpdateItem(
                          item.id,
                          'price',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Button
            onClick={handleSave}
            variant="primary"
            size="large"
            fullWidth
          >
            Atualizar Configurações
          </Button>
        </div>
      </div>
    </div>
  )
}


