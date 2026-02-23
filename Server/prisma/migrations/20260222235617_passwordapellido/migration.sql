/*
  Warnings:

  - Added the required column `Apellido` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `Apellido` VARCHAR(100) NOT NULL,
    MODIFY `Password` VARCHAR(255) NOT NULL;
