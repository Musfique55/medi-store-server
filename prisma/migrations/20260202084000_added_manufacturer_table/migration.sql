/*
  Warnings:

  - You are about to drop the column `manufacturer` on the `medicine` table. All the data in the column will be lost.
  - Added the required column `manufacturer_id` to the `medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicine" DROP COLUMN "manufacturer",
ADD COLUMN     "manufacturer_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "manufacturer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo_url" TEXT,
    "country" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "manufacturer_id_name_idx" ON "manufacturer"("id", "name");

-- AddForeignKey
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
