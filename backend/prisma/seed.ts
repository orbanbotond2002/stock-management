import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import { prisma } from '../src/db/prisma.js'

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const managerPassword = await bcrypt.hash('manager123', 10)
  const viewerPassword = await bcrypt.hash('viewer123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@helixsoft.com' },
    update: {},
    create: {
      email: 'admin@helixsoft.com',
      passwordHash: adminPassword,
      role: UserRole.admin,
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@helixsoft.com' },
    update: {},
    create: {
      email: 'manager@helixsoft.com',
      passwordHash: managerPassword,
      role: UserRole.manager,
    },
  })

  await prisma.user.upsert({
    where: { email: 'viewer@helixsoft.com' },
    update: {},
    create: {
      email: 'viewer@helixsoft.com',
      passwordHash: viewerPassword,
      role: UserRole.viewer,
    },
  })

  const warehouse1 = await prisma.warehouse.upsert({
    where: { id: 'warehouse-1' },
    update: {
      name: 'Budapest Main Warehouse',
    },
    create: {
      id: 'warehouse-1',
      name: 'Budapest Main Warehouse',
      location: 'Budapest',
    },
  })

  const warehouse2 = await prisma.warehouse.upsert({
    where: { id: 'warehouse-2' },
    update: {
      name: 'Debrecen Warehouse',
    },
    create: {
      id: 'warehouse-2',
      name: 'Debrecen Warehouse',
      location: 'Debrecen',
    },
  })

  const products = [
    { id: 'product-1', sku: 'SKU-001', name: 'Laptop', description: 'Gaming laptop' },
    { id: 'product-2', sku: 'SKU-002', name: 'Monitor', description: '27" 4K monitor' },
    { id: 'product-3', sku: 'SKU-003', name: 'Keyboard', description: 'Mechanical keyboard' },
    { id: 'product-4', sku: 'SKU-004', name: 'Mouse', description: 'Wireless mouse' },
    { id: 'product-5', sku: 'SKU-005', name: 'Headset', description: 'Noise cancelling headset' },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
      },
      create: product,
    })
  }

  for (const product of products) {
    await prisma.stock.upsert({
      where: {
        productId_warehouseId: {
          productId: product.id,
          warehouseId: warehouse1.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        warehouseId: warehouse1.id,
        quantity: 50,
      },
    })

    await prisma.stock.upsert({
      where: {
        productId_warehouseId: {
          productId: product.id,
          warehouseId: warehouse2.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        warehouseId: warehouse2.id,
        quantity: 30,
      },
    })
  }

  console.log('Seed data inserted successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())