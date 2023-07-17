-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "code" TEXT NOT NULL,
    "expired" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectAnswers" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "expired" TIMESTAMP(3) NOT NULL,
    "answersData" JSONB NOT NULL,

    CONSTRAINT "CorrectAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_code_key" ON "Verification"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CorrectAnswers_userId_key" ON "CorrectAnswers"("userId");

-- AddForeignKey
ALTER TABLE "CorrectAnswers" ADD CONSTRAINT "CorrectAnswers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
