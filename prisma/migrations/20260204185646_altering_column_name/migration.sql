/*
  Warnings:

  - You are about to drop the column `unit_price` on the `medicine` table. All the data in the column will be lost.
  - Added the required column `purchase_price` to the `medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicine" DROP COLUMN "unit_price",
ADD COLUMN     "purchase_price" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "discount_value" SET DEFAULT 0;
