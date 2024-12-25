/*
  Warnings:

  - You are about to drop the column `productId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `CategoriesName` on the `Fruit` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Fruit_CategoriesName_fkey` ON `Fruit`;

-- AlterTable
ALTER TABLE `Categories` DROP COLUMN `productId`;

-- AlterTable
ALTER TABLE `Fruit` DROP COLUMN `CategoriesName`;
