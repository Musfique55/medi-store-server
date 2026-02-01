/*
  Warnings:

  - The values [customer,seller,admin] on the enum `roles` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "roles_new" AS ENUM ('CUSTOMER', 'SELLER', 'ADMIN');
ALTER TABLE "user" ALTER COLUMN "role" TYPE "roles_new" USING ("role"::text::"roles_new");
ALTER TYPE "roles" RENAME TO "roles_old";
ALTER TYPE "roles_new" RENAME TO "roles";
DROP TYPE "public"."roles_old";
COMMIT;

-- DropIndex
DROP INDEX "user_email_id_key";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
