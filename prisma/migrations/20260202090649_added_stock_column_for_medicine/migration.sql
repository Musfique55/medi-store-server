/*
  Warnings:

  - Added the required column `stock` to the `medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicine" ADD COLUMN     "stock" INTEGER NOT NULL;
