-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_catalog_id_fkey";

-- AlterTable
ALTER TABLE "catalog" ADD COLUMN     "inventory_id" TEXT;
