/*
  Warnings:

  - Made the column `inventory_id` on table `catalog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "catalog" ALTER COLUMN "inventory_id" SET NOT NULL;
