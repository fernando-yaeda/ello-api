/*
  Warnings:

  - Added the required column `colorId` to the `cards_labels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cards_labels" ADD COLUMN     "colorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "colors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cards_labels" ADD CONSTRAINT "cards_labels_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
