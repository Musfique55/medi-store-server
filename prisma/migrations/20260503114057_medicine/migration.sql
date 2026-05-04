/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `medicine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,seller_id]` on the table `medicine` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "medicine_name_key";

-- AlterTable
ALTER TABLE "medicine" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "medicine_slug_key" ON "medicine"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "medicine_name_seller_id_key" ON "medicine"("name", "seller_id");
