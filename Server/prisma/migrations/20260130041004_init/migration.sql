-- CreateTable
CREATE TABLE `Usuario` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Cedula` VARCHAR(50) NOT NULL,
    `Nombre` VARCHAR(100) NOT NULL,
    `Rol` VARCHAR(50) NOT NULL,
    `EstaActivo` BOOLEAN NOT NULL,

    UNIQUE INDEX `Usuario_Cedula_key`(`Cedula`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingrediente` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `CantidadKilos` DOUBLE NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Platillo` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `Precio` DOUBLE NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlatilloIngrediente` (
    `CantidadKilosIngrediente` DOUBLE NOT NULL,
    `IDPlatillo` INTEGER NOT NULL,
    `IDIngrediente` INTEGER NOT NULL,

    PRIMARY KEY (`IDPlatillo`, `IDIngrediente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mesa` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `NumeroMesa` INTEGER NOT NULL,
    `EstaOcupada` BOOLEAN NOT NULL,

    UNIQUE INDEX `Mesa_NumeroMesa_key`(`NumeroMesa`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orden` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDMesa` INTEGER NOT NULL,
    `IDUsuario` INTEGER NOT NULL,
    `FechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Total` DOUBLE NOT NULL,
    `Estado` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenPlatillo` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDOrden` INTEGER NOT NULL,
    `IDPlatillo` INTEGER NOT NULL,
    `Cantidad` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Factura` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDOrden` INTEGER NOT NULL,
    `FechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `TotalBruto` DOUBLE NOT NULL,
    `Impuestos` DOUBLE NOT NULL,
    `Total` DOUBLE NOT NULL,

    UNIQUE INDEX `Factura_IDOrden_key`(`IDOrden`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reserva` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `CedulaCliente` VARCHAR(50) NOT NULL,
    `NombreCliente` VARCHAR(100) NOT NULL,
    `TelefonoCliente` VARCHAR(20) NOT NULL,
    `IDMesa` INTEGER NOT NULL,
    `IDUsuario` INTEGER NOT NULL,
    `FechaReserva` DATETIME(3) NOT NULL,
    `HoraReserva` VARCHAR(20) NOT NULL,
    `NumeroPersonas` INTEGER NOT NULL,
    `Nota` VARCHAR(255) NULL,

    PRIMARY KEY (`ID`)
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
