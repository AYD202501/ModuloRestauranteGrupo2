// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los productos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category, imageUrl, createdById } = body;

    // Validaciones básicas
    if (!name || !price || stock === undefined || !category || !createdById) {
      return NextResponse.json(
        { error: 'Campos requeridos: name, price, stock, category, createdById' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        imageUrl: imageUrl || null,
        createdById
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Error de duplicado (nombre único)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un producto con este nombre' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}