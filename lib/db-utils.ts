// Utilitários para gerenciar o banco de dados JSON
import fs from 'fs'
import path from 'path'

const DB_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DB_DIR, 'users.json')
const ORDERS_FILE = path.join(DB_DIR, 'orders.json')

// Garantir que o diretório existe
export function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
}

// Ler usuários do arquivo
export function readUsers(): any[] {
  ensureDbDir()
  if (!fs.existsSync(USERS_FILE)) {
    // Criar usuário de exemplo
    const exampleUser = {
      id: 'example-user-1',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      password: '123456',
      balance: 100.00,
      createdAt: new Date().toISOString(),
    }
    writeUsers([exampleUser])
    return [exampleUser]
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Escrever usuários no arquivo
export function writeUsers(users: any[]): void {
  ensureDbDir()
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

// Ler pedidos do arquivo
export function readOrders(): any[] {
  ensureDbDir()
  if (!fs.existsSync(ORDERS_FILE)) {
    writeOrders([])
    return []
  }
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Escrever pedidos no arquivo
export function writeOrders(orders: any[]): void {
  ensureDbDir()
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
}


