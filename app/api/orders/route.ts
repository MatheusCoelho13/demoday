import { NextRequest, NextResponse } from 'next/server'
import { readOrders, writeOrders } from '@/lib/db-utils'

// GET - Buscar pedidos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')
    const userId = searchParams.get('userId')
    const barId = searchParams.get('barId')

    const orders = readOrders()

    if (orderId) {
      const order = orders.find(o => o.orderId === orderId)
      if (!order) {
        return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
      }
      return NextResponse.json(order)
    }

    if (userId) {
      const userOrders = orders.filter(o => o.userId === userId)
      return NextResponse.json(userOrders)
    }

    if (barId) {
      const barOrders = orders.filter(o => o.barId === barId)
      return NextResponse.json(barOrders)
    }

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}

// POST - Criar novo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, barId, items, total, paymentMethod } = body

    if (!userId || !barId || !items || !total || !paymentMethod) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const orders = readOrders()

    // Criar novo pedido
    const newOrder = {
      id: `order-${Date.now()}`,
      orderId: `ORD-${Date.now()}`,
      userId,
      barId,
      items,
      total,
      paymentMethod,
      status: 'paid',
      createdAt: new Date().toISOString(),
    }

    orders.push(newOrder)
    writeOrders(orders)

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
  }
}

// PUT - Atualizar status do pedido
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId e status são obrigatórios' }, { status: 400 })
    }

    const orders = readOrders()
    const orderIndex = orders.findIndex(o => o.orderId === orderId)

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    orders[orderIndex].status = status
    writeOrders(orders)

    return NextResponse.json(orders[orderIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 500 })
  }
}


