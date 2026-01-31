/*
  Warnings:

  - A unique constraint covering the columns `[category_name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `medicine` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "category_category_name_key" ON "category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "medicine_name_key" ON "medicine"("name");
