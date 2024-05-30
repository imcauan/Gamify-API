/*
  Warnings:

  - You are about to drop the `Images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_postId_fkey";

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "image" TEXT NOT NULL;

-- DropTable
DROP TABLE "Images";
