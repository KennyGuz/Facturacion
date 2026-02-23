/*
  Warnings:

  - The primary key for the `Factura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `IDOrden` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Ingrediente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `Ingrediente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Mesa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `Mesa` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `NumeroMesa` on the `Mesa` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Orden` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `Orden` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `IDMesa` on the `Orden` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `IDUsuario` on the `Orden` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `OrdenPlatillo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `OrdenPlatillo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `IDOrden` on the `OrdenPlatillo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `IDPlatillo` on the `OrdenPlatillo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Platillo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `Platillo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `PlatilloIngrediente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `IDPlatillo` on the `PlatilloIngrediente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `IDIngrediente` on the `PlatilloIngrediente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Reserva` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `Reserva` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `IDMesa` on the `Reserva` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `IDUsuario` on the `Reserva` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `Role` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `A` on the `_RoleToUsuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `B` on the `_RoleToUsuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Factura` DROP FOREIGN KEY `Factura_IDOrden_fkey`;

-- DropForeignKey
ALTER TABLE `Orden` DROP FOREIGN KEY `Orden_IDMesa_fkey`;

-- DropForeignKey
ALTER TABLE `Orden` DROP FOREIGN KEY `Orden_IDUsuario_fkey`;

-- DropForeignKey
ALTER TABLE `OrdenPlatillo` DROP FOREIGN KEY `OrdenPlatillo_IDOrden_fkey`;

-- DropForeignKey
ALTER TABLE `OrdenPlatillo` DROP FOREIGN KEY `OrdenPlatillo_IDPlatillo_fkey`;

-- DropForeignKey
ALTER TABLE `PlatilloIngrediente` DROP FOREIGN KEY `PlatilloIngrediente_IDIngrediente_fkey`;

-- DropForeignKey
ALTER TABLE `PlatilloIngrediente` DROP FOREIGN KEY `PlatilloIngrediente_IDPlatillo_fkey`;

-- DropForeignKey
ALTER TABLE `Reserva` DROP FOREIGN KEY `Reserva_IDMesa_fkey`;

-- DropForeignKey
ALTER TABLE `Reserva` DROP FOREIGN KEY `Reserva_IDUsuario_fkey`;

-- DropForeignKey
ALTER TABLE `_RoleToUsuario` DROP FOREIGN KEY `_RoleToUsuario_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RoleToUsuario` DROP FOREIGN KEY `_RoleToUsuario_B_fkey`;

-- DropIndex
DROP INDEX `Orden_IDMesa_fkey` ON `Orden`;

-- DropIndex
DROP INDEX `Orden_IDUsuario_fkey` ON `Orden`;

-- DropIndex
DROP INDEX `OrdenPlatillo_IDOrden_fkey` ON `OrdenPlatillo`;

-- DropIndex
DROP INDEX `OrdenPlatillo_IDPlatillo_fkey` ON `OrdenPlatillo`;

-- DropIndex
DROP INDEX `PlatilloIngrediente_IDIngrediente_fkey` ON `PlatilloIngrediente`;

-- DropIndex
DROP INDEX `Reserva_IDMesa_fkey` ON `Reserva`;

-- DropIndex
DROP INDEX `Reserva_IDUsuario_fkey` ON `Reserva`;

-- AlterTable
ALTER TABLE `Factura` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `IDOrden` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `Ingrediente` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `Mesa` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `NumeroMesa` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `Orden` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `IDMesa` INTEGER NOT NULL,
    MODIFY `IDUsuario` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `OrdenPlatillo` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `IDOrden` INTEGER NOT NULL,
    MODIFY `IDPlatillo` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `Platillo` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `PlatilloIngrediente` DROP PRIMARY KEY,
    MODIFY `IDPlatillo` INTEGER NOT NULL,
    MODIFY `IDIngrediente` INTEGER NOT NULL,
    ADD PRIMARY KEY (`IDPlatillo`, `IDIngrediente`);

-- AlterTable
ALTER TABLE `Reserva` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `IDMesa` INTEGER NOT NULL,
    MODIFY `IDUsuario` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `Role` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `Usuario` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `_RoleToUsuario` MODIFY `A` INTEGER NOT NULL,
    MODIFY `B` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `PlatilloIngrediente` ADD CONSTRAINT `PlatilloIngrediente_IDPlatillo_fkey` FOREIGN KEY (`IDPlatillo`) REFERENCES `Platillo`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlatilloIngrediente` ADD CONSTRAINT `PlatilloIngrediente_IDIngrediente_fkey` FOREIGN KEY (`IDIngrediente`) REFERENCES `Ingrediente`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orden` ADD CONSTRAINT `Orden_IDMesa_fkey` FOREIGN KEY (`IDMesa`) REFERENCES `Mesa`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orden` ADD CONSTRAINT `Orden_IDUsuario_fkey` FOREIGN KEY (`IDUsuario`) REFERENCES `Usuario`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenPlatillo` ADD CONSTRAINT `OrdenPlatillo_IDOrden_fkey` FOREIGN KEY (`IDOrden`) REFERENCES `Orden`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenPlatillo` ADD CONSTRAINT `OrdenPlatillo_IDPlatillo_fkey` FOREIGN KEY (`IDPlatillo`) REFERENCES `Platillo`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Factura` ADD CONSTRAINT `Factura_IDOrden_fkey` FOREIGN KEY (`IDOrden`) REFERENCES `Orden`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_IDMesa_fkey` FOREIGN KEY (`IDMesa`) REFERENCES `Mesa`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_IDUsuario_fkey` FOREIGN KEY (`IDUsuario`) REFERENCES `Usuario`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUsuario` ADD CONSTRAINT `_RoleToUsuario_A_fkey` FOREIGN KEY (`A`) REFERENCES `Role`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUsuario` ADD CONSTRAINT `_RoleToUsuario_B_fkey` FOREIGN KEY (`B`) REFERENCES `Usuario`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
