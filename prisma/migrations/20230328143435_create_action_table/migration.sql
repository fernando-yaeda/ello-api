/*
  Warnings:

  - You are about to drop the column `action` on the `card_activity` table. All the data in the column will be lost.
  - Added the required column `actionId` to the `card_activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "card_activity" DROP COLUMN "action",
ADD COLUMN     "actionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
