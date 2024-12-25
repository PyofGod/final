/*
  Warnings:

  - You are about to drop the `_ProductCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductFruit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Categories` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Fruits` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Fruit` DROP FOREIGN KEY `Fruit_CategoriesName_fkey`;

-- DropForeignKey
ALTER TABLE `_ProductCategory` DROP FOREIGN KEY `_ProductCategory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProductCategory` DROP FOREIGN KEY `_ProductCategory_B_fkey`;

-- DropForeignKey
ALTER TABLE `_ProductFruit` DROP FOREIGN KEY `_ProductFruit_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProductFruit` DROP FOREIGN KEY `_ProductFruit_B_fkey`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `Categories` VARCHAR(191) NOT NULL,
    ADD COLUMN `Fruits` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_ProductCategory`;

-- DropTable
DROP TABLE `_ProductFruit`;
