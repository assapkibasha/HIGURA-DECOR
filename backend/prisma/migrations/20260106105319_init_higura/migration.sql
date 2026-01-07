/*
  Warnings:

  - You are about to drop the column `link` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `senderType` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the `_employeetasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `backorder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `partner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pushsubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requisition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requisitionitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requisitionitemdelivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salesreturn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salesreturnitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stockin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stockout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_employeetasks` DROP FOREIGN KEY `_EmployeeTasks_A_fkey`;

-- DropForeignKey
ALTER TABLE `_employeetasks` DROP FOREIGN KEY `_EmployeeTasks_B_fkey`;

-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `backorder` DROP FOREIGN KEY `BackOrder_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `backorder` DROP FOREIGN KEY `BackOrder_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `expense` DROP FOREIGN KEY `Expense_reportId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `requisition` DROP FOREIGN KEY `Requisition_partnerId_fkey`;

-- DropForeignKey
ALTER TABLE `requisitionitem` DROP FOREIGN KEY `RequisitionItem_approvedById_fkey`;

-- DropForeignKey
ALTER TABLE `requisitionitem` DROP FOREIGN KEY `RequisitionItem_requisitionId_fkey`;

-- DropForeignKey
ALTER TABLE `requisitionitem` DROP FOREIGN KEY `RequisitionItem_stockInId_fkey`;

-- DropForeignKey
ALTER TABLE `requisitionitemdelivery` DROP FOREIGN KEY `RequisitionItemDelivery_confirmedByPartnerId_fkey`;

-- DropForeignKey
ALTER TABLE `requisitionitemdelivery` DROP FOREIGN KEY `RequisitionItemDelivery_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `requisitionitemdelivery` DROP FOREIGN KEY `RequisitionItemDelivery_requisitionItemId_fkey`;

-- DropForeignKey
ALTER TABLE `salesreturnitem` DROP FOREIGN KEY `SalesReturnItem_salesReturnId_fkey`;

-- DropForeignKey
ALTER TABLE `salesreturnitem` DROP FOREIGN KEY `SalesReturnItem_stockoutId_fkey`;

-- DropForeignKey
ALTER TABLE `stockin` DROP FOREIGN KEY `StockIn_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `stockin` DROP FOREIGN KEY `StockIn_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `stockin` DROP FOREIGN KEY `StockIn_productId_fkey`;

-- DropForeignKey
ALTER TABLE `stockout` DROP FOREIGN KEY `StockOut_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `stockout` DROP FOREIGN KEY `StockOut_backorderId_fkey`;

-- DropForeignKey
ALTER TABLE `stockout` DROP FOREIGN KEY `StockOut_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `stockout` DROP FOREIGN KEY `StockOut_stockinId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_reportId_fkey`;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `link`,
    DROP COLUMN `senderId`,
    DROP COLUMN `senderType`,
    DROP COLUMN `title`,
    ADD COLUMN `createdById` VARCHAR(191) NULL,
    ADD COLUMN `readMap` JSON NULL;

-- DropTable
DROP TABLE `_employeetasks`;

-- DropTable
DROP TABLE `activity`;

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `backorder`;

-- DropTable
DROP TABLE `category`;

-- DropTable
DROP TABLE `employee`;

-- DropTable
DROP TABLE `expense`;

-- DropTable
DROP TABLE `partner`;

-- DropTable
DROP TABLE `product`;

-- DropTable
DROP TABLE `pushsubscription`;

-- DropTable
DROP TABLE `report`;

-- DropTable
DROP TABLE `requisition`;

-- DropTable
DROP TABLE `requisitionitem`;

-- DropTable
DROP TABLE `requisitionitemdelivery`;

-- DropTable
DROP TABLE `salesreturn`;

-- DropTable
DROP TABLE `salesreturnitem`;

-- DropTable
DROP TABLE `stockin`;

-- DropTable
DROP TABLE `stockout`;

-- DropTable
DROP TABLE `task`;

-- DropTable
DROP TABLE `transaction`;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `refreshTokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phoneE164` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_phoneE164_key`(`phoneE164`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stock` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `imageUrls` JSON NULL,
    `dailyLateFee` INTEGER NOT NULL DEFAULT 1000,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Stock_createdById_idx`(`createdById`),
    INDEX `Stock_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rental` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `deadlineDate` DATETIME(3) NOT NULL,
    `paidAmount` INTEGER NOT NULL,
    `status` ENUM('rented', 'returned') NOT NULL DEFAULT 'rented',
    `processedById` VARCHAR(191) NOT NULL,
    `rentedOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnedOn` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Rental_customerId_idx`(`customerId`),
    INDEX `Rental_status_idx`(`status`),
    INDEX `Rental_deadlineDate_idx`(`deadlineDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentalItem` (
    `id` VARCHAR(191) NOT NULL,
    `rentalId` VARCHAR(191) NOT NULL,
    `stockId` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `dailyLateFeeSnapshot` INTEGER NOT NULL DEFAULT 1000,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RentalItem_rentalId_idx`(`rentalId`),
    INDEX `RentalItem_stockId_idx`(`stockId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoryRental` (
    `id` VARCHAR(191) NOT NULL,
    `rentalId` VARCHAR(191) NOT NULL,
    `customerSnapshot` JSON NOT NULL,
    `itemsSnapshot` JSON NOT NULL,
    `rentedOn` DATETIME(3) NOT NULL,
    `returnedOn` DATETIME(3) NULL,
    `lateDays` INTEGER NOT NULL,
    `totalFees` INTEGER NOT NULL,
    `processedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `HistoryRental_rentalId_key`(`rentalId`),
    INDEX `HistoryRental_processedById_idx`(`processedById`),
    INDEX `HistoryRental_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SyncMutation` (
    `id` VARCHAR(191) NOT NULL,
    `clientMutationId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('APPLIED', 'FAILED') NOT NULL,
    `errorMessage` VARCHAR(191) NULL,
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SyncMutation_clientMutationId_key`(`clientMutationId`),
    INDEX `SyncMutation_userId_idx`(`userId`),
    INDEX `SyncMutation_appliedAt_idx`(`appliedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Notification_createdAt_idx` ON `Notification`(`createdAt`);

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_processedById_fkey` FOREIGN KEY (`processedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalItem` ADD CONSTRAINT `RentalItem_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `Rental`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalItem` ADD CONSTRAINT `RentalItem_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoryRental` ADD CONSTRAINT `HistoryRental_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `Rental`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoryRental` ADD CONSTRAINT `HistoryRental_processedById_fkey` FOREIGN KEY (`processedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SyncMutation` ADD CONSTRAINT `SyncMutation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
