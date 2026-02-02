/*
  Warnings:

  - Added the required column `shipping_address` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "delivery_method" TEXT NOT NULL DEFAULT 'Cash on Delivery',
ADD COLUMN     "shipping_address" TEXT NOT NULL;
