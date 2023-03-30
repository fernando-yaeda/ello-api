/*
  Warnings:

  - The primary key for the `actions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `actions` table. All the data in the column will be lost.
  - You are about to drop the column `actionId` on the `card_activity` table. All the data in the column will be lost.
  - Added the required column `actionPerformed` to the `card_activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "card_activity" DROP CONSTRAINT "card_activity_actionId_fkey";

-- AlterTable
ALTER TABLE "actions" DROP CONSTRAINT "actions_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "actions_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "card_activity" DROP COLUMN "actionId",
ADD COLUMN     "actionPerformed" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_actionPerformed_fkey" FOREIGN KEY ("actionPerformed") REFERENCES "actions"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
