/*
  Warnings:

  - You are about to drop the column `firstId` on the `Chats` table. All the data in the column will be lost.
  - You are about to drop the column `secondId` on the `Chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "firstId",
DROP COLUMN "secondId",
ADD COLUMN     "members" TEXT[];
