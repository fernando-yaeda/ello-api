/*
  Warnings:

  - You are about to drop the `cardActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `card_labels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cardActivity" DROP CONSTRAINT "cardActivity_cardId_fkey";

-- DropForeignKey
ALTER TABLE "cardActivity" DROP CONSTRAINT "cardActivity_performedBy_fkey";

-- DropForeignKey
ALTER TABLE "card_labels" DROP CONSTRAINT "card_labels_cardId_fkey";

-- DropForeignKey
ALTER TABLE "card_labels" DROP CONSTRAINT "card_labels_labelId_fkey";

-- DropTable
DROP TABLE "cardActivity";

-- DropTable
DROP TABLE "card_labels";

-- CreateTable
CREATE TABLE "card_activity" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "performedBy" TEXT NOT NULL,

    CONSTRAINT "card_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards_labels" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_labels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards_labels" ADD CONSTRAINT "cards_labels_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards_labels" ADD CONSTRAINT "cards_labels_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
