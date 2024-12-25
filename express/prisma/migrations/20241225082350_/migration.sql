-- AlterTable
ALTER TABLE `Fruit` ADD COLUMN `CategoriesName` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `productId` INTEGER NULL,

    UNIQUE INDEX `Categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Discontinued` INTEGER NOT NULL,
    `QuantityPerUnit` VARCHAR(191) NULL,
    `ReorderLevel` INTEGER NOT NULL,
    `SupplierId` INTEGER NOT NULL,
    `UnitPrice` VARCHAR(191) NOT NULL,
    `UnitsInStock` INTEGER NOT NULL,
    `UnitsOnOrder` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductFruit` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProductFruit_AB_unique`(`A`, `B`),
    INDEX `_ProductFruit_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductCategory` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProductCategory_AB_unique`(`A`, `B`),
    INDEX `_ProductCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fruit` ADD CONSTRAINT `Fruit_CategoriesName_fkey` FOREIGN KEY (`CategoriesName`) REFERENCES `Categories`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductFruit` ADD CONSTRAINT `_ProductFruit_A_fkey` FOREIGN KEY (`A`) REFERENCES `Fruit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductFruit` ADD CONSTRAINT `_ProductFruit_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductCategory` ADD CONSTRAINT `_ProductCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `Categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductCategory` ADD CONSTRAINT `_ProductCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
