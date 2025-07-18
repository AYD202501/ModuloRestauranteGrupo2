// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un producto específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar un producto
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category, imageUrl } = body;

    // Validaciones básicas
    if (!name || price === undefined || stock === undefined || !category) {
      return NextResponse.json(
        { error: 'Campos requeridos: name, price, stock, category' },
        { status: 400 }
      );
    }

    if (parseFloat(price) < 0) {
      return NextResponse.json(
        { error: 'El precio debe ser mayor o igual a 0' },
        { status: 400 }
      );
    }

    if (parseInt(stock) < 0) {
      return NextResponse.json(
        { error: 'El stock debe ser mayor o igual a 0' },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        imageUrl: imageUrl || null,
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Error de duplicado (nombre único)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un producto con este nombre' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si tiene movimientos asociados
    const movementsCount = await prisma.movement.count({
      where: { productId: params.id }
    });

    if (movementsCount > 0) {
      // En lugar de eliminar, desactivar el producto
      const deactivatedProduct = await prisma.product.update({
        where: { id: params.id },
        data: { isActive: false }
      });

      return NextResponse.json({
        message: 'Producto desactivado debido a movimientos existentes',
        product: deactivatedProduct
      });
    }

    // Si no tiene movimientos, eliminar completamente
    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    
    // Error de restricción de foreign key
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'No se puede eliminar el producto porque tiene movimientos asociados' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}