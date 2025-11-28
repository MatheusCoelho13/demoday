'use client'

import { motion } from 'framer-motion'

interface QuantityButtonProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  className?: string
}

export default function QuantityButton({
  quantity,
  onIncrease,
  onDecrease,
  className = '',
}: QuantityButtonProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDecrease}
        className="w-10 h-10 rounded-full bg-orange-vibrant hover:bg-orange-burnt flex items-center justify-center text-white font-bold text-lg transition-colors"
      >
        −
      </motion.button>
      <span className="text-white font-semibold text-lg min-w-[30px] text-center">
        {quantity}
      </span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onIncrease}
        className="w-10 h-10 rounded-full bg-orange-vibrant hover:bg-orange-burnt flex items-center justify-center text-white font-bold text-lg transition-colors"
      >
        +
      </motion.button>
    </div>
  )
}


