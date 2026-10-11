-- DropForeignKey
ALTER TABLE "ActivityData" DROP CONSTRAINT "ActivityData_uploadId_fkey";

-- CreateIndex
CREATE INDEX "ActivityData_uploadId_idx" ON "ActivityData"("uploadId");

-- AddForeignKey
ALTER TABLE "ActivityData" ADD CONSTRAINT "ActivityData_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
