// Sistema de banco de dados interno usando localStorage

export interface User {
  id: string
  name: string
  email: string
  password: string
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

// Funções para gerenciar usuários
export const getUser = (userId: string): User | null => {
  const users = getUsers()
  return users.find(u => u.id === userId) || null
}

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return []
  const usersJson = localStorage.getItem('users')
  return usersJson ? JSON.parse(usersJson) : []
}

export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return
  const users = getUsers()
  const index = users.findIndex(u => u.id === user.id)
  if (index >= 0) {
    users[index] = user
  } else {
    users.push(user)
  }
  localStorage.setItem('users', JSON.stringify(users))
}

export const updateUserBalance = (userId: string, amount: number): boolean => {
  const user = getUser(userId)
  if (!user) return false
  
  const newBalance = user.balance + amount
  if (newBalance < 0) return false // Saldo insuficiente
  
  user.balance = newBalance
  saveUser(user)
  
  // Atualizar localStorage do usuário logado
  if (typeof window !== 'undefined') {
    const currentUserId = localStorage.getItem('userId')
    if (currentUserId === userId) {
      localStorage.setItem('userBalance', newBalance.toString())
    }
  }
  
  return true
}

export const debitUserBalance = (userId: string, amount: number): boolean => {
  const user = getUser(userId)
  if (!user || user.balance < amount) return false
  
  return updateUserBalance(userId, -amount)
}

// Funções para gerenciar pedidos
export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return []
  const ordersJson = localStorage.getItem('orders')
  return ordersJson ? JSON.parse(ordersJson) : []
}

export const saveOrder = (order: Order): void => {
  if (typeof window === 'undefined') return
  const orders = getOrders()
  orders.push(order)
  localStorage.setItem('orders', JSON.stringify(orders))
}

export const getOrder = (orderId: string): Order | null => {
  const orders = getOrders()
  return orders.find(o => o.orderId === orderId) || null
}

// Inicializar banco de dados com usuário de exemplo
export const initializeDatabase = (): void => {
  if (typeof window === 'undefined') return
  
  // Verificar se já foi inicializado
  if (localStorage.getItem('db_initialized') === 'true') return
  
  const users = getUsers()
  
  // Criar usuário de exemplo se não existir
  const exampleUser: User = {
    id: 'example-user-1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    password: '123456', // Em produção, seria hash
    balance: 100.00, // Saldo de exemplo
    createdAt: new Date().toISOString(),
  }
  
  // Verificar se o usuário de exemplo já existe
  const userExists = users.find(u => u.email === exampleUser.email)
  if (!userExists) {
    users.push(exampleUser)
    localStorage.setItem('users', JSON.stringify(users))
  }
  
  // Marcar como inicializado
  localStorage.setItem('db_initialized', 'true')
}


