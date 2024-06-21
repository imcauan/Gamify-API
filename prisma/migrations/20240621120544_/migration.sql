/*
  Warnings:

  - You are about to drop the `_ChatsToUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstId` to the `Chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondId` to the `Chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ChatsToUsers" DROP CONSTRAINT "_ChatsToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatsToUsers" DROP CONSTRAINT "_ChatsToUsers_B_fkey";

-- AlterTable
ALTER TABLE "Chats" ADD COLUMN     "firstId" TEXT NOT NULL,
ADD COLUMN     "secondId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ChatsToUsers";
