'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/design-system/Card'
import Button from '@/components/design-system/Button'

export default function ScannerPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<'idle' | 'valid' | 'invalid' | null>(null)
  const [scannedCode, setScannedCode] = useState<string>('')

  useEffect(() => {
    const loggedIn = localStorage.getItem('barLoggedIn')
    if (!loggedIn) {
      router.push('/bar/login')
    }
  }, [router])

  const handleScan = () => {
    setIsScanning(true)
    setScanResult(null)

    // Simular leitura do QR Code após 2 segundos
    setTimeout(() => {
      const codes = ['ORD-1234567890', 'ORD-1234567891', 'ORD-INVALID']
      const randomCode = codes[Math.floor(Math.random() * codes.length)]
      setScannedCode(randomCode)
      
      if (randomCode.includes('INVALID')) {
        setScanResult('invalid')
      } else {
        setScanResult('valid')
      }
      
      setIsScanning(false)
    }, 2000)
  }

  const handleReset = () => {
    setScanResult(null)
    setScannedCode('')
    setIsScanning(false)
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
          <h1 className="text-3xl font-bold text-white mb-2">Scanner QR Code</h1>
          <p className="text-gray-400">Escaneie o QR Code do cliente</p>
        </motion.div>

        <Card className="p-6 mb-6">
          <div className="aspect-square bg-dark-graphite rounded-lg border-2 border-dashed border-orange-vibrant flex items-center justify-center mb-6 relative overflow-hidden">
            {isScanning ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-32 h-32 border-4 border-orange-vibrant rounded-lg mx-auto mb-4"
                />
                <p className="text-orange-vibrant font-semibold">
                  Escaneando...
                </p>
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-gray-400">Área de leitura do QR Code</p>
              </div>
            )}
          </div>

          <Button
            onClick={isScanning ? undefined : handleScan}
            variant={isScanning ? 'disabled' : 'primary'}
            size="large"
            fullWidth
          >
            {isScanning ? 'Escaneando...' : 'Iniciar Escaneamento'}
          </Button>
        </Card>

        <AnimatePresence>
          {scanResult === 'valid' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 bg-green-500/10 border-green-500/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl">✓</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1">
                      Pedido Confirmado
                    </h2>
                    <p className="text-gray-300">
                      Código: {scannedCode}
                    </p>
                  </div>
                </div>
                <p className="text-green-400 font-semibold mb-4">
                  Entregar agora.
                </p>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="medium"
                  fullWidth
                >
                  Escanear Próximo
                </Button>
              </Card>
            </motion.div>
          )}

          {scanResult === 'invalid' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 bg-red-500/10 border-red-500/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl">✕</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1">
                      QR Inválido
                    </h2>
                    <p className="text-gray-300">
                      Código: {scannedCode}
                    </p>
                  </div>
                </div>
                <p className="text-red-400 font-semibold mb-4">
                  QR inválido ou já retirado.
                </p>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="medium"
                  fullWidth
                >
                  Tentar Novamente
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


