/*
  Warnings:

  - A unique constraint covering the columns `[productId,cartId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cartId_fkey";

-- DropIndex
DROP INDEX "cart_items_id_idx";

-- CreateIndex
CREATE INDEX "cart_items_id_cartId_idx" ON "cart_items"("id", "cartId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_productId_cartId_key" ON "cart_items"("productId", "cartId");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
