/*
  Warnings:

  - The `delivery_method` column on the `order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[order_number]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_number` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `shipping_address` on the `order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DeliveryMethods" AS ENUM ('COD', 'ONLINE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED');

-- DropIndex
DROP INDEX "order_id_customer_id_idx";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "order_number" TEXT NOT NULL,
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL,
DROP COLUMN "delivery_method",
ADD COLUMN     "delivery_method" "DeliveryMethods" NOT NULL DEFAULT 'COD',
DROP COLUMN "shipping_address",
ADD COLUMN     "shipping_address" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "order_order_number_key" ON "order"("order_number");

-- CreateIndex
CREATE INDEX "order_customer_id_idx" ON "order"("customer_id");
