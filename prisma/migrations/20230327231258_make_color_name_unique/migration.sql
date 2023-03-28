/*
  Warnings:

  - A unique constraint covering the columns `[name,color]` on the table `colors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "colors_name_color_key" ON "colors"("name", "color");
