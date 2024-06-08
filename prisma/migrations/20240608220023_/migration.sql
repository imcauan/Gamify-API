/*
  Warnings:

  - Added the required column `updatedAt` to the `Commentaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commentaries" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "communityId" TEXT,
ALTER COLUMN "image" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Likes" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Communities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
