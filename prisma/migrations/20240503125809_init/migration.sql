-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "email" VARCHAR(50),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "updateAt" TIMESTAMP(6),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staffs" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6),

    CONSTRAINT "Staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reports" (
    "id" TEXT NOT NULL,
    "revenue" REAL NOT NULL,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6),

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportsOnStaffs" (
    "id" TEXT NOT NULL,
    "staffId" VARCHAR(50) NOT NULL,
    "reportId" VARCHAR(50) NOT NULL,
    "checkIn" VARCHAR(10) NOT NULL,
    "checkOut" VARCHAR(10) NOT NULL,
    "timeWorked" REAL NOT NULL,
    "target" REAL NOT NULL,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6),

    CONSTRAINT "ReportsOnStaffs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staffs_name_key" ON "Staffs"("name");

-- AddForeignKey
ALTER TABLE "ReportsOnStaffs" ADD CONSTRAINT "ReportsOnStaffs_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportsOnStaffs" ADD CONSTRAINT "ReportsOnStaffs_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
