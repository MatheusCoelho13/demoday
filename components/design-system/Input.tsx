'use client'

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  label?: string
  name?: string
  required?: boolean
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  label,
  name,
  required = false,
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 bg-dark-gray border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-vibrant focus:ring-2 focus:ring-orange-vibrant/20 transition-all ${className}`}
      />
    </div>
  )
}


