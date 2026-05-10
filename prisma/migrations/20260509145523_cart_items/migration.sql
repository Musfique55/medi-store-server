/*
  Warnings:

  - You are about to drop the column `cartId` on the `cart_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id,cart_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cart_id` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cartId_fkey";

-- DropIndex
DROP INDEX "cart_items_id_cartId_idx";

-- DropIndex
DROP INDEX "cart_items_product_id_cartId_key";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "cartId",
ADD COLUMN     "cart_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "cart_items_id_cart_id_idx" ON "cart_items"("id", "cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_product_id_cart_id_key" ON "cart_items"("product_id", "cart_id");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
