/*
  Warnings:

  - You are about to drop the column `productId` on the `cart_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id,cartId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cart_items_productId_cartId_key";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "productId",
ADD COLUMN     "product_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_product_id_cartId_key" ON "cart_items"("product_id", "cartId");
