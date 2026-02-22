/*
  Warnings:

  - You are about to drop the column `EstaActivo` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Factura` ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Ingrediente` ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Mesa` ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Orden` ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `OrdenPlatillo` ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Platillo` ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `PlatilloIngrediente` ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Reserva` ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Role` ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `EstaActivo`,
    ADD COLUMN `Active` BOOLEAN NOT NULL DEFAULT true;
