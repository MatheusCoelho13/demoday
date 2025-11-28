'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'disabled'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
  
  const variantStyles = {
    primary: 'bg-orange-vibrant hover:bg-orange-burnt text-white active:scale-95',
    secondary: 'bg-dark-gray hover:bg-[#2A2A2A] text-white border border-orange-vibrant active:scale-95',
    disabled: 'bg-[#2A2A2A] text-gray-400 cursor-not-allowed',
  }
  
  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }
  
  const widthStyle = fullWidth ? 'w-full' : ''
  
  const isDisabled = variant === 'disabled'
  
  return (
    <motion.button
      type={type}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={isDisabled ? undefined : onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={isDisabled}
    >
      {children}
    </motion.button>
  )
}


