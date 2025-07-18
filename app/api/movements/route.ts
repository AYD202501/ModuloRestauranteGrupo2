// app/api/movements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener movimientos con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const whereClause = productId ? { productId } : {};

    const movements = await prisma.movement.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            name: true
          }
        },
        executedBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(movements);
  } catch (error) {
    console.error('Error fetching movements:', error);
    return NextResponse.json(
      { error: 'Error al obtener movimientos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo movimiento
export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando creación de movimiento...');
    
    const body = await request.json();
    console.log('Datos recibidos:', body);
    
    const { productId, type, quantity, executedById } = body;

    // Validaciones básicas
    if (!productId || !type || !quantity || !executedById) {
      console.log('Faltan campos requeridos');
      return NextResponse.json(
        { error: 'Campos requeridos: productId, type, quantity, executedById' },
        { status: 400 }
      );
    }

    if (!['ENTRADA', 'SALIDA'].includes(type)) {
      console.log('Tipo de movimiento inválido:', type);
      return NextResponse.json(
        { error: 'Tipo inválido. Debe ser ENTRADA o SALIDA' },
        { status: 400 }
      );
    }

    const quantityInt = parseInt(quantity);
    if (quantityInt <= 0) {
      console.log('Cantidad inválida:', quantity);
      return NextResponse.json(
        { error: 'La cantidad debe ser mayor a 0' },
        { status: 400 }
      );
    }

    console.log('Buscando producto:', productId);

    // Obtener producto actual para validar stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      console.log('Producto no encontrado:', productId);
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    console.log('Producto encontrado:', product.name, 'Stock:', product.stock);

    // Validar que no se retire más stock del disponible
    if (type === 'SALIDA' && product.stock < quantityInt) {
      console.log('Stock insuficiente. Disponible:', product.stock, 'Solicitado:', quantityInt);
      return NextResponse.json(
        { error: `Stock insuficiente. Disponible: ${product.stock}` },
        { status: 400 }
      );
    }

    console.log('Verificando usuario:', executedById);

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: executedById }
    });

    if (!user) {
      console.log('Usuario no encontrado:', executedById);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    console.log('Usuario encontrado:', user.email);

    // Usar transacción para crear movimiento y actualizar stock
    console.log('Iniciando transacción...');
    
    const result = await prisma.$transaction(async (tx) => {
      // Crear movimiento
      console.log('Creando movimiento...');
      const movement = await tx.movement.create({
        data: {
          productId,
          type,
          quantity: quantityInt,
          executedById
        },
        include: {
          product: {
            select: {
              name: true
            }
          },
          executedBy: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      // Actualizar stock del producto
      const newStock = type === 'ENTRADA' 
        ? product.stock + quantityInt
        : product.stock - quantityInt;

      console.log('Actualizando stock. Anterior:', product.stock, 'Nuevo:', newStock);

      await tx.product.update({
        where: { id: productId },
        data: { stock: newStock }
      });

      console.log('Transacción completada exitosamente');
      return movement;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating movement:', error);
    console.error('Stack trace:', error.stack);
    
    // Verificar tipos específicos de error de Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error de duplicado en la base de datos' },
        { status: 409 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Error al crear movimiento' },
      { status: 500 }
    );
  }
}