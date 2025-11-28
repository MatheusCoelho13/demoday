// Cliente API para comunicação com o backend

export interface User {
  id: string
  name: string
  email: string
  balance: number
  createdAt: string
}

export interface Order {
  id: string
  orderId: string
  userId: string
  barId: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  paymentMethod: 'pix' | 'card' | 'balance'
  status: 'pending' | 'paid' | 'validated' | 'completed'
  createdAt: string
}

// API de Usuários
export const userApi = {
  // Buscar usuário por email
  getByEmail: async (email: string): Promise<User | null> => {
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  },

  // Buscar usuário por ID
  getById: async (id: string): Promise<User | null> => {
    try {
      const response = await fetch(`/api/users?id=${encodeURIComponent(id)}`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  },

  // Criar usuário
  create: async (name: string, email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao criar usuário')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      throw error
    }
  },

  // Login
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao fazer login')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    }
  },

  // Atualizar saldo
  updateBalance: async (userId: string, amount: number, operation: 'add' | 'subtract'): Promise<number | null> => {
    try {
      const response = await fetch(`/api/users/${userId}/balance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, operation }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao atualizar saldo')
      }
      const data = await response.json()
      return data.balance
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error)
      throw error
    }
  },
}

// API de Pedidos
export const orderApi = {
  // Buscar pedido por ID
  getByOrderId: async (orderId: string): Promise<Order | null> => {
    try {
      const response = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar pedido:', error)
      return null
    }
  },

  // Buscar pedidos por usuário
  getByUserId: async (userId: string): Promise<Order[]> => {
    try {
      const response = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`)
      if (!response.ok) return []
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      return []
    }
  },

  // Criar pedido
  create: async (order: Omit<Order, 'id' | 'orderId' | 'createdAt'>): Promise<Order | null> => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao criar pedido')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      throw error
    }
  },

  // Atualizar status do pedido
  updateStatus: async (orderId: string, status: Order['status']): Promise<Order | null> => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao atualizar pedido')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
      throw error
    }
  },
}


