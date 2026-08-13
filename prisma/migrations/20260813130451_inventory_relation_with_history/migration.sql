/*
  Warnings:

  - You are about to drop the column `catalog_id` on the `history` table. All the data in the column will be lost.
  - Added the required column `inventory_id` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "history_catalog_id_idx";

-- AlterTable
ALTER TABLE "history" DROP COLUMN "catalog_id",
ADD COLUMN     "inventory_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "history_inventory_id_idx" ON "history"("inventory_id");

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
