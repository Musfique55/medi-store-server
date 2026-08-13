/*
  Warnings:

  - You are about to drop the column `product_count` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `review` table. All the data in the column will be lost.
  - You are about to drop the `medicine` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tax` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catalog_id` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catalog_name` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catalog_id` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('IN', 'OUT');

-- DropForeignKey
ALTER TABLE "medicine" DROP CONSTRAINT "medicine_category_id_fkey";

-- DropForeignKey
ALTER TABLE "medicine" DROP CONSTRAINT "medicine_manufacturer_id_fkey";

-- DropForeignKey
ALTER TABLE "medicine" DROP CONSTRAINT "medicine_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_product_id_fkey";

-- DropIndex
DROP INDEX "order_customer_id_idx";

-- DropIndex
DROP INDEX "order_items_id_order_id_product_id_idx";

-- DropIndex
DROP INDEX "review_id_product_id_idx";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "product_count",
ADD COLUMN     "catalog_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- Clear existing test data from affected tables to allow schema changes
DELETE FROM "review";
DELETE FROM "order_items";
DELETE FROM "order";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "tax" DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE "order" ALTER COLUMN "tax" DROP DEFAULT;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "product_id",
ADD COLUMN     "catalog_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "catalog_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE "order_items" ALTER COLUMN "catalog_id" DROP DEFAULT;
ALTER TABLE "order_items" ALTER COLUMN "catalog_name" DROP DEFAULT;
ALTER TABLE "order_items" ALTER COLUMN "total" DROP DEFAULT;

-- AlterTable
ALTER TABLE "review" DROP COLUMN "product_id",
ADD COLUMN     "catalog_id" TEXT NOT NULL DEFAULT '';
ALTER TABLE "review" ALTER COLUMN "catalog_id" DROP DEFAULT;

-- DropTable
DROP TABLE "medicine";

-- CreateTable
CREATE TABLE "catalog" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "manufacturer_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "retails_price" DECIMAL(10,2) NOT NULL,
    "purchase_price" DECIMAL(10,2) NOT NULL,
    "discount_type" "discountType" NOT NULL DEFAULT 'NONE',
    "discount_value" INTEGER DEFAULT 0,
    "stock" INTEGER NOT NULL,
    "reserved_stock" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "inventory_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "catalog_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" TEXT NOT NULL,
    "catalog_id" TEXT NOT NULL,
    "current_quantity" INTEGER NOT NULL,
    "new_quantity" INTEGER NOT NULL,
    "quantity_changed" INTEGER NOT NULL,
    "action_type" "ActionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalog_id_key" ON "catalog"("id");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_slug_key" ON "catalog"("slug");

-- CreateIndex
CREATE INDEX "catalog_category_id_seller_id_idx" ON "catalog"("category_id", "seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_name_seller_id_key" ON "catalog"("name", "seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_id_key" ON "inventory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_catalog_id_key" ON "inventory"("catalog_id");

-- CreateIndex
CREATE UNIQUE INDEX "history_id_key" ON "history"("id");

-- CreateIndex
CREATE INDEX "history_catalog_id_idx" ON "history"("catalog_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "order_id_key" ON "order"("id");

-- CreateIndex
CREATE INDEX "order_customer_id_order_number_idx" ON "order"("customer_id", "order_number");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_id_key" ON "order_items"("id");

-- CreateIndex
CREATE INDEX "order_items_order_id_catalog_id_idx" ON "order_items"("order_id", "catalog_id");

-- CreateIndex
CREATE INDEX "review_id_catalog_id_idx" ON "review"("id", "catalog_id");

-- AddForeignKey
ALTER TABLE "catalog" ADD CONSTRAINT "catalog_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog" ADD CONSTRAINT "catalog_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog" ADD CONSTRAINT "catalog_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_catalog_id_fkey" FOREIGN KEY ("catalog_id") REFERENCES "catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
