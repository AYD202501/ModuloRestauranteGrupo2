/*
  Warnings:

  - You are about to drop the column `masterId` on the `movements` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `movements` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `masters` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `movements` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('DESAYUNO', 'ALMUERZO', 'CENA', 'BEBIDA', 'POSTRE');

-- DropForeignKey
ALTER TABLE "masters" DROP CONSTRAINT "masters_createdById_fkey";

-- DropForeignKey
ALTER TABLE "movements" DROP CONSTRAINT "movements_masterId_fkey";

-- AlterTable
ALTER TABLE "movements" DROP COLUMN "masterId",
ADD COLUMN     "productId" TEXT NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "masters";

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "category" "Category" NOT NULL DEFAULT 'ALMUERZO',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movements" ADD CONSTRAINT "movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
