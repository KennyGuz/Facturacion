/*
  Warnings:

  - You are about to drop the column `IDRol` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `UpdatedAt` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Ingrediente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Mesa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Orden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `OrdenPlatillo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Platillo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `PlatilloIngrediente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Factura` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Ingrediente` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Mesa` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Orden` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `OrdenPlatillo` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Platillo` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `PlatilloIngrediente` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Reserva` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Role` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `IDRol`,
    ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL;
