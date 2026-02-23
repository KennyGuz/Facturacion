/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Email` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `Email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_Email_key` ON `Usuario`(`Email`);
