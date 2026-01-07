/*
  Warnings:

  - A unique constraint covering the columns `[nationalId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customer` ADD COLUMN `nationalId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `stock` ADD COLUMN `reorderThreshold` INTEGER NOT NULL DEFAULT 2;

-- CreateIndex
CREATE UNIQUE INDEX `Customer_nationalId_key` ON `Customer`(`nationalId`);
