import { NextRequest, NextResponse } from 'next/server'
import { readUsers } from '@/lib/db-utils'

// POST - Login de usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const users = readUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 })
  }
}


