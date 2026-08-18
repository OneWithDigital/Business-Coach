-- CreateTable
CREATE TABLE "BusinessPlanInput" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT,
    "onePagerPitch" TEXT,
    "targetCustomer" TEXT,
    "problemSolved" TEXT,
    "revenueModel" TEXT,
    "competitiveEdge" TEXT,
    "startupCosts" DOUBLE PRECISION,
    "monthlyCosts" DOUBLE PRECISION,
    "pricePerUnit" DOUBLE PRECISION,
    "variableCostPerUnit" DOUBLE PRECISION,
    "expectedMonthlyUnits" DOUBLE PRECISION,
    "unitLabel" TEXT,
    "marketingPlan" TEXT,
    "fundingNeeded" BOOLEAN NOT NULL DEFAULT false,
    "fundingAmount" DOUBLE PRECISION,
    "fundingUse" TEXT,
    "milestones" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessPlanInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessPlanDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessPlanDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessPlanInput_userId_key" ON "BusinessPlanInput"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessPlanDocument_userId_key" ON "BusinessPlanDocument"("userId");

-- AddForeignKey
ALTER TABLE "BusinessPlanInput" ADD CONSTRAINT "BusinessPlanInput_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessPlanDocument" ADD CONSTRAINT "BusinessPlanDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
