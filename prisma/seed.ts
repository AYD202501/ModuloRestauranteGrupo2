// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Crear usuarios iniciales
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      name: 'Administrator',
      role: 'ADMIN',
    },
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@restaurant.com' },
    update: {},
    create: {
      email: 'user@restaurant.com',
      name: 'Regular User',
      role: 'USER',
    },
  })

  // Crear productos/platillos iniciales
  const product1 = await prisma.product.create({
    data: {
      name: 'Pollo Teriyaki',
      description: 'Delicioso pollo con salsa teriyaki acompañado de arroz y vegetales',
      price: 15.99,
      stock: 100,
      category: 'ALMUERZO',
      imageUrl: 'https://example.com/pollo-teriyaki.jpg',
      createdById: adminUser.id,
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: 'Pasta Penne',
      description: 'Pasta penne con salsa de tomate y albahaca fresca',
      price: 12.99,
      stock: 75,
      category: 'ALMUERZO',
      imageUrl: 'https://example.com/pasta-penne.jpg',
      createdById: adminUser.id,
    },
  })

  const product3 = await prisma.product.create({
    data: {
      name: 'Pizza Margherita',
      description: 'Pizza clásica con tomate, mozzarella y albahaca',
      price: 29.99,
      stock: 50,
      category: 'CENA',
      imageUrl: 'https://example.com/pizza-margherita.jpg',
      createdById: adminUser.id,
    },
  })

  const product4 = await prisma.product.create({
    data: {
      name: 'Pancakes',
      description: 'Pancakes esponjosos con miel y frutas frescas',
      price: 7.99,
      stock: 30,
      category: 'DESAYUNO',
      imageUrl: 'https://example.com/pancakes.jpg',
      createdById: adminUser.id,
    },
  })

  const product5 = await prisma.product.create({
    data: {
      name: 'Hamburguesa Clásica',
      description: 'Hamburguesa de carne con lechuga, tomate y papas fritas',
      price: 13.99,
      stock: 40,
      category: 'ALMUERZO',
      imageUrl: 'https://example.com/hamburguesa.jpg',
      createdById: adminUser.id,
    },
  })

  // Crear algunos movimientos iniciales
  await prisma.movement.createMany({
    data: [
      {
        type: 'ENTRADA',
        quantity: 20,
        productId: product1.id,
        executedById: adminUser.id,
      },
      {
        type: 'SALIDA',
        quantity: 5,
        productId: product1.id,
        executedById: regularUser.id,
      },
      {
        type: 'ENTRADA',
        quantity: 30,
        productId: product2.id,
        executedById: adminUser.id,
      },
      {
        type: 'SALIDA',
        quantity: 10,
        productId: product3.id,
        executedById: regularUser.id,
      },
    ],
  })


}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })