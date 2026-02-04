/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "discountType" AS ENUM ('NONE', 'PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "medicine" ADD COLUMN     "discount_type" "discountType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "discount_value" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "review_order_id_key" ON "review"("order_id");
