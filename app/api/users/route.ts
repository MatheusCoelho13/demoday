import { NextRequest, NextResponse } from 'next/server'
import { readUsers, writeUsers } from '@/lib/db-utils'

// GET - Buscar todos os usuários ou um usuário específico
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const id = searchParams.get('id')

    const users = readUsers()

    if (email) {
      const user = users.find(u => u.email === email)
      if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
      }
      // Não retornar a senha
      const { password, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword)
    }

    if (id) {
      const user = users.find(u => u.id === id)
      if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
      }
      // Não retornar a senha
      const { password, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword)
    }

    // Retornar todos os usuários sem senhas
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)
    return NextResponse.json(usersWithoutPasswords)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const users = readUsers()

    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
    }

    // Criar novo usuário
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // Em produção, deveria ser hash
      balance: 0,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    writeUsers(users)

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}

// PUT - Atualizar usuário
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 })
    }

    const users = readUsers()
    const userIndex = users.findIndex(u => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Atualizar usuário
    users[userIndex] = { ...users[userIndex], ...updates }
    writeUsers(users)

    // Retornar usuário sem senha
    const { password, ...userWithoutPassword } = users[userIndex]
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
  }
}


