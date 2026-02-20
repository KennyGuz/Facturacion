-- CreateTable
CREATE TABLE `Role` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Role_Name_key`(`Name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `Cedula` VARCHAR(50) NOT NULL,
    `Nombre` VARCHAR(100) NOT NULL,
    `IDRol` BIGINT NOT NULL,
    `EstaActivo` BOOLEAN NOT NULL,

    UNIQUE INDEX `Usuario_Cedula_key`(`Cedula`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingrediente` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `CantidadKilos` DOUBLE NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Platillo` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `Precio` DOUBLE NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlatilloIngrediente` (
    `CantidadKilosIngrediente` DOUBLE NOT NULL,
    `IDPlatillo` BIGINT NOT NULL,
    `IDIngrediente` BIGINT NOT NULL,

    PRIMARY KEY (`IDPlatillo`, `IDIngrediente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mesa` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `NumeroMesa` BIGINT NOT NULL,
    `EstaOcupada` BOOLEAN NOT NULL,

    UNIQUE INDEX `Mesa_NumeroMesa_key`(`NumeroMesa`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orden` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `IDMesa` BIGINT NOT NULL,
    `IDUsuario` BIGINT NOT NULL,
    `FechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Total` DOUBLE NOT NULL,
    `Estado` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenPlatillo` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `IDOrden` BIGINT NOT NULL,
    `IDPlatillo` BIGINT NOT NULL,
    `Cantidad` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Factura` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `IDOrden` BIGINT NOT NULL,
    `FechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `TotalBruto` DOUBLE NOT NULL,
    `Impuestos` DOUBLE NOT NULL,
    `Total` DOUBLE NOT NULL,

    UNIQUE INDEX `Factura_IDOrden_key`(`IDOrden`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reserva` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `CedulaCliente` VARCHAR(50) NOT NULL,
    `NombreCliente` VARCHAR(100) NOT NULL,
    `TelefonoCliente` VARCHAR(20) NOT NULL,
    `IDMesa` BIGINT NOT NULL,
    `IDUsuario` BIGINT NOT NULL,
    `FechaReserva` DATETIME(3) NOT NULL,
    `HoraReserva` VARCHAR(20) NOT NULL,
    `NumeroPersonas` INTEGER NOT NULL,
    `Nota` VARCHAR(255) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoleToUsuario` (
    `A` BIGINT NOT NULL,
    `B` BIGINT NOT NULL,

    UNIQUE INDEX `_RoleToUsuario_AB_unique`(`A`, `B`),
    INDEX `_RoleToUsuario_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
