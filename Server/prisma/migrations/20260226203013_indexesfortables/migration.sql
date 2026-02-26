/*
  Warnings:

  - You are about to drop the column `FechaHora` on the `Factura` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `Factura` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Factura` DROP COLUMN `FechaHora`,
    DROP COLUMN `UpdatedAt`;

-- AlterTable
ALTER TABLE `Mesa` MODIFY `EstaOcupada` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Factura_CreatedAt_idx` ON `Factura`(`CreatedAt`);

-- CreateIndex
CREATE INDEX `Mesa_EstaOcupada_idx` ON `Mesa`(`EstaOcupada`);

-- CreateIndex
CREATE INDEX `Mesa_NumeroMesa_idx` ON `Mesa`(`NumeroMesa`);

-- CreateIndex
CREATE INDEX `Reserva_NombreCliente_idx` ON `Reserva`(`NombreCliente`);

-- CreateIndex
CREATE INDEX `Reserva_CedulaCliente_idx` ON `Reserva`(`CedulaCliente`);

-- CreateIndex
CREATE INDEX `Reserva_TelefonoCliente_idx` ON `Reserva`(`TelefonoCliente`);

-- CreateIndex
CREATE INDEX `Reserva_NumeroPersonas_idx` ON `Reserva`(`NumeroPersonas`);

-- CreateIndex
CREATE INDEX `Usuario_Cedula_idx` ON `Usuario`(`Cedula`);

-- CreateIndex
CREATE INDEX `Usuario_Email_idx` ON `Usuario`(`Email`);

-- CreateIndex
CREATE INDEX `Usuario_Nombre_idx` ON `Usuario`(`Nombre`);

-- CreateIndex
CREATE INDEX `Usuario_Apellido_idx` ON `Usuario`(`Apellido`);
