-- CreateEnum
CREATE TYPE "ConferenceStatus" AS ENUM ('OPEN', 'FINISHED');

-- CreateTable
CREATE TABLE "Conference" (
    "id" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "status" "ConferenceStatus" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conference_short_key" ON "Conference"("short");

-- CreateIndex
CREATE UNIQUE INDEX "Conference_providerId_key" ON "Conference"("providerId");

-- AddForeignKey
ALTER TABLE "Conference" ADD CONSTRAINT "Conference_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
