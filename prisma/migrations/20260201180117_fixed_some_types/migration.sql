/*
  Warnings:

  - You are about to alter the column `retails_price` on the `medicine` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `unit_price` on the `medicine` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total_amount` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `unit_price` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `manufacturer` to the `medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicine" ADD COLUMN     "manufacturer" TEXT NOT NULL,
ALTER COLUMN "retails_price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "unit_price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "total_amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "unit_price" SET DATA TYPE DECIMAL(10,2);
