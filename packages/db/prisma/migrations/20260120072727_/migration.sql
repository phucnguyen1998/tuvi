-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'staff');

-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('pending', 'running', 'done', 'failed');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'staff',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NatalChart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NatalChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NatalChartInput" (
    "id" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "rawInput" JSONB NOT NULL,
    "normalized" JSONB NOT NULL,
    "gender" TEXT NOT NULL,
    "yearOfBirth" INTEGER NOT NULL,
    "viewingYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NatalChartInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NatalChartSnapshot" (
    "id" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NatalChartSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIReading" (
    "id" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'pending',
    "provider" TEXT,
    "model" TEXT,
    "promptVersion" TEXT,
    "prompt" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "content" TEXT,
    "errorMessage" TEXT,
    "latencyMs" INTEGER,
    "usageTokens" INTEGER,
    "costUsd" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptTemplate" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "NatalChart_createdAt_idx" ON "NatalChart"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NatalChartInput_chartId_key" ON "NatalChartInput"("chartId");

-- CreateIndex
CREATE INDEX "NatalChartInput_yearOfBirth_idx" ON "NatalChartInput"("yearOfBirth");

-- CreateIndex
CREATE INDEX "NatalChartInput_gender_idx" ON "NatalChartInput"("gender");

-- CreateIndex
CREATE INDEX "NatalChartInput_viewingYear_idx" ON "NatalChartInput"("viewingYear");

-- CreateIndex
CREATE UNIQUE INDEX "NatalChartSnapshot_chartId_key" ON "NatalChartSnapshot"("chartId");

-- CreateIndex
CREATE INDEX "AIReading_status_idx" ON "AIReading"("status");

-- CreateIndex
CREATE INDEX "AIReading_chartId_idx" ON "AIReading"("chartId");

-- CreateIndex
CREATE INDEX "AIReading_createdAt_idx" ON "AIReading"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PromptTemplate_version_key" ON "PromptTemplate"("version");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "NatalChartInput" ADD CONSTRAINT "NatalChartInput_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "NatalChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatalChartSnapshot" ADD CONSTRAINT "NatalChartSnapshot_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "NatalChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIReading" ADD CONSTRAINT "AIReading_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "NatalChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
