/*
  Warnings:

  - You are about to alter the column `price` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "cart" ADD COLUMN     "reservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "cart_items" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "medicine" ADD COLUMN     "reserved_stock" INTEGER NOT NULL DEFAULT 0;
