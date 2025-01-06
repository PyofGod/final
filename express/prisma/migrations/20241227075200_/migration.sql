/*
  Warnings:

  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Categories` table. All the data in the column will be lost.
  - The primary key for the `Fruit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Fruit` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Categories` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.
  - The required column `Id` was added to the `Categories` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `Id` to the `Fruit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CategoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Categories` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `Id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `Fruit` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    DROP COLUMN `Categories`,
    DROP COLUMN `id`,
    ADD COLUMN `CategoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`Id`);

-- CreateTable
CREATE TABLE `Employee` (
    `Address` VARCHAR(191) NULL,
    `BirthDate` VARCHAR(191) NULL,
    `City` VARCHAR(191) NULL,
    `Country` VARCHAR(191) NULL,
    `Extension` VARCHAR(191) NULL,
    `FirstName` VARCHAR(191) NULL,
    `HireDate` VARCHAR(191) NULL,
    `HomePhone` VARCHAR(191) NULL,
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `LastName` VARCHAR(191) NULL,
    `Notes` VARCHAR(191) NULL,
    `Photo` VARCHAR(191) NULL,
    `PhotoPath` VARCHAR(191) NULL,
    `PostalCode` VARCHAR(191) NULL,
    `Region` VARCHAR(191) NULL,
    `ReportsTo` INTEGER NULL,
    `Title` VARCHAR(191) NULL,
    `TitleOfCourtesy` VARCHAR(191) NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `Address` VARCHAR(191) NULL,
    `City` VARCHAR(191) NULL,
    `CompanyName` VARCHAR(191) NULL,
    `ContactName` VARCHAR(191) NULL,
    `ContactTitle` VARCHAR(191) NULL,
    `Country` VARCHAR(191) NULL,
    `Fax` VARCHAR(191) NULL,
    `Id` VARCHAR(191) NOT NULL,
    `Phone` VARCHAR(191) NULL,
    `PostalCode` VARCHAR(191) NULL,
    `Region` VARCHAR(191) NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
