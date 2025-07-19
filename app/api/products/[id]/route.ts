// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un producto específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const product = await prisma.product.findUnique({
      where: { id: resolvedParams.id },
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
  } catch (error: unknown) {
    console.error('Error fetching product:', error);
    const message = (error instanceof Error) ? error.message : 'Error al obtener producto';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar un producto
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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
      where: { id: resolvedParams.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: resolvedParams.id },
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
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if ((error as { code?: string }).code === 'P2002') {
        return NextResponse.json(
          { error: 'Ya existe un producto con este nombre' },
          { status: 409 }
        );
      }
    }
    const message = (error instanceof Error) ? error.message : 'Error al actualizar producto';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si tiene movimientos asociados
    const movementsCount = await prisma.movement.count({
      where: { productId: resolvedParams.id }
    });

    if (movementsCount > 0) {
      // En lugar de eliminar, desactivar el producto
      const deactivatedProduct = await prisma.product.update({
        where: { id: resolvedParams.id },
        data: { isActive: false }
      });

      return NextResponse.json({
        message: 'Producto desactivado debido a movimientos existentes',
        product: deactivatedProduct
      });
    }

    // Si no tiene movimientos, eliminar completamente
    await prisma.product.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error: unknown) {
    console.error('Error deleting product:', error);
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if ((error as { code?: string }).code === 'P2003') {
        return NextResponse.json(
          { error: 'No se puede eliminar el producto porque tiene movimientos asociados' },
          { status: 409 }
        );
      }
    }
    const message = (error instanceof Error) ? error.message : 'Error al eliminar producto';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}