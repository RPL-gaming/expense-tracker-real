/*
  Warnings:

  - You are about to drop the column `isAdvisor` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `FinancialAdvisor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `FinancialAdvisor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FinancialAdvisor" DROP CONSTRAINT "FinancialAdvisor_id_fkey";

-- AlterTable
ALTER TABLE "FinancialAdvisor" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isAdvisor";

-- CreateIndex
CREATE UNIQUE INDEX "FinancialAdvisor_userId_key" ON "FinancialAdvisor"("userId");

-- AddForeignKey
ALTER TABLE "FinancialAdvisor" ADD CONSTRAINT "FinancialAdvisor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
