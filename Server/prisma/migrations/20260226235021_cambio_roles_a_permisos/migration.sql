/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleToUsuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_RoleToUsuario` DROP FOREIGN KEY `_RoleToUsuario_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RoleToUsuario` DROP FOREIGN KEY `_RoleToUsuario_B_fkey`;

-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `Rol` VARCHAR(50) NOT NULL DEFAULT 'Trabajador';

-- DropTable
DROP TABLE `Role`;

-- DropTable
DROP TABLE `_RoleToUsuario`;

-- CreateTable
CREATE TABLE `Permisos` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(50) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdatedAt` DATETIME(3) NOT NULL,
    `Active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Permisos_Name_key`(`Name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermisosToUsuario` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PermisosToUsuario_AB_unique`(`A`, `B`),
    INDEX `_PermisosToUsuario_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PermisosToUsuario` ADD CONSTRAINT `_PermisosToUsuario_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permisos`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermisosToUsuario` ADD CONSTRAINT `_PermisosToUsuario_B_fkey` FOREIGN KEY (`B`) REFERENCES `Usuario`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
