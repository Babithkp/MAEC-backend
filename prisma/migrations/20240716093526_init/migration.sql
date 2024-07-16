/*
  Warnings:

  - The `paid_amount` column on the `Documents` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `amount_to_pay` column on the `Documents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "paid_amount",
ADD COLUMN     "paid_amount" INTEGER DEFAULT 0,
DROP COLUMN "amount_to_pay",
ADD COLUMN     "amount_to_pay" INTEGER;
