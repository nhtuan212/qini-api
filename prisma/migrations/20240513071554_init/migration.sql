-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "email" VARCHAR(50),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "updateAt" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staffs" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6),

    CONSTRAINT "staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "shiftId" VARCHAR(50) NOT NULL,
    "revenue" REAL NOT NULL,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6),

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports_on_staffs" (
    "id" TEXT NOT NULL,
    "staffId" VARCHAR(50) NOT NULL,
    "reportId" VARCHAR(50) NOT NULL,
    "checkIn" VARCHAR(10) NOT NULL,
    "checkOut" VARCHAR(10) NOT NULL,
    "timeWorked" REAL NOT NULL,
    "target" REAL NOT NULL,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6),

    CONSTRAINT "reports_on_staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6),

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_name_key" ON "staffs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "shifts_name_key" ON "shifts"("name");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports_on_staffs" ADD CONSTRAINT "reports_on_staffs_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports_on_staffs" ADD CONSTRAINT "reports_on_staffs_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
