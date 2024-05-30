/*
  Warnings:

  - You are about to drop the column `subtitle` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "subtitle",
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "tags" TEXT;
