/*
  Warnings:

  - Added the required column `Password` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `Password` VARCHAR(36) NOT NULL;
