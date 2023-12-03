-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isAdvisor" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "FinancialAdvisor" ADD CONSTRAINT "FinancialAdvisor_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
