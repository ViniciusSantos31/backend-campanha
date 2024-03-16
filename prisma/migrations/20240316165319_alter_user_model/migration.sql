/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `cpf` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doc` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fistName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PROVIDER', 'REQUESTER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'OFFLINE', 'BUSY', 'PAUSED');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "company" INTEGER,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "doc" TEXT NOT NULL,
ADD COLUMN     "fistName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OFFLINE',
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'REQUESTER',
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uuid");
