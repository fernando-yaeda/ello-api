/*
  Warnings:

  - You are about to drop the column `colorId` on the `cards_labels` table. All the data in the column will be lost.
  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `colors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[color]` on the table `colors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `colorName` to the `labels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_userId_fkey";

-- DropForeignKey
ALTER TABLE "cards_labels" DROP CONSTRAINT "cards_labels_colorId_fkey";

-- DropIndex
DROP INDEX "colors_name_color_key";

-- AlterTable
ALTER TABLE "cards_labels" DROP COLUMN "colorId";

-- AlterTable
ALTER TABLE "labels" ADD COLUMN     "colorName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Participant";

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_userId_projectId_key" ON "participants"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "colors_name_key" ON "colors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "colors_color_key" ON "colors"("color");

-- CreateIndex
CREATE INDEX "colors_name_idx" ON "colors"("name");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labels" ADD CONSTRAINT "labels_colorName_fkey" FOREIGN KEY ("colorName") REFERENCES "colors"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
