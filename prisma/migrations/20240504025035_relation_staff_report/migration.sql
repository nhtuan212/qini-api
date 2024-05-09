-- AlterTable
ALTER TABLE "Reports" ADD COLUMN     "staffId" VARCHAR(50) NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
