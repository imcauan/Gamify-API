/*
  Warnings:

  - You are about to drop the column `destination` on the `Messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "destination",
ADD COLUMN     "chatId" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Chats" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatsToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatsToUsers_AB_unique" ON "_ChatsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatsToUsers_B_index" ON "_ChatsToUsers"("B");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatsToUsers" ADD CONSTRAINT "_ChatsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatsToUsers" ADD CONSTRAINT "_ChatsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
