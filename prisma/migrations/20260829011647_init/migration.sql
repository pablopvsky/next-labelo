-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "workos_user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_picture_url" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "last_sign_in_at" TIMESTAMP(3),
    "locale" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "workos_created_at" TIMESTAMP(3) NOT NULL,
    "workos_updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_workos_user_id_key" ON "users"("workos_user_id");
