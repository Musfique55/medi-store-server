/*
  Warnings:

  - You are about to drop the column `current_quantity` on the `history` table. All the data in the column will be lost.
  - Added the required column `last_quantity` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "history" DROP COLUMN "current_quantity",
ADD COLUMN     "last_quantity" INTEGER NOT NULL;
