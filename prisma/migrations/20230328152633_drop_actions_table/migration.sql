/*
  Warnings:

  - You are about to drop the `actions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "card_activity" DROP CONSTRAINT "card_activity_actionPerformed_fkey";

-- DropTable
DROP TABLE "actions";
