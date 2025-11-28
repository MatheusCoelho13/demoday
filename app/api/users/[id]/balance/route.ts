import { NextRequest, NextResponse } from 'next/server'
import { readUsers, writeUsers } from '@/lib/db-utils'

// PUT - Atualizar saldo do usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { amount, operation } = body // operation: 'add' | 'subtract'

    if (typeof amount !== 'number') {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
    }

    const users = readUsers()
    const userIndex = users.findIndex(u => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const user = users[userIndex]

    // Calcular novo saldo
    let newBalance: number
    if (operation === 'subtract') {
      if (user.balance < amount) {
        return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })
      }
      newBalance = user.balance - amount
    } else {
      newBalance = user.balance + amount
    }

    // Atualizar saldo
    users[userIndex].balance = newBalance
    writeUsers(users)

    return NextResponse.json({ 
      balance: newBalance,
      message: operation === 'subtract' ? 'Saldo debitado com sucesso' : 'Saldo adicionado com sucesso'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar saldo' }, { status: 500 })
  }
}


