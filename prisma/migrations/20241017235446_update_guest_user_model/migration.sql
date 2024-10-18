/*
  Warnings:

  - Added the required column `companyId` to the `GuestUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conference" ADD COLUMN     "guestUserId" TEXT;

-- AlterTable
ALTER TABLE "GuestUser" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "inQueueSince" TIMESTAMP(3),
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'REQUESTER';

-- AddForeignKey
ALTER TABLE "GuestUser" ADD CONSTRAINT "GuestUser_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conference" ADD CONSTRAINT "Conference_guestUserId_fkey" FOREIGN KEY ("guestUserId") REFERENCES "GuestUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
