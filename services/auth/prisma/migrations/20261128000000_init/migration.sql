-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Manager', 'Agent', 'Client');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Deactivated');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('Available', 'Away');

-- CreateEnum
CREATE TYPE "SessionAudience" AS ENUM ('CoreApi', 'RewardsApi');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" CITEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "reports_to" UUID,
    "status" "UserStatus" NOT NULL DEFAULT 'Active',
    "must_change_password" BOOLEAN NOT NULL DEFAULT false,
    "availability" "Availability",
    "max_clients" SMALLINT,
    "waiting_since" TIMESTAMPTZ(6),
    "terms_accepted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "parent_sid" UUID,
    "audience" "SessionAudience" NOT NULL,
    "device_label" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sso_codes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code_hash" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "parent_sid" UUID NOT NULL,
    "code_challenge" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "consumed_at" TIMESTAMPTZ(6),

    CONSTRAINT "sso_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "succeeded" BOOLEAN NOT NULL,
    "ip" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "secret_hash" TEXT NOT NULL,
    "scopes" TEXT[],
    "audience" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMPTZ(6),

    CONSTRAINT "auth_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_reports_to_idx" ON "users"("reports_to");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_parent_sid_idx" ON "sessions"("parent_sid");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_session_id_idx" ON "refresh_tokens"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "sso_codes_code_hash_key" ON "sso_codes"("code_hash");

-- CreateIndex
CREATE INDEX "sso_codes_user_id_idx" ON "sso_codes"("user_id");

-- CreateIndex
CREATE INDEX "sso_codes_parent_sid_idx" ON "sso_codes"("parent_sid");

-- CreateIndex
CREATE INDEX "login_attempts_email_created_at_idx" ON "login_attempts"("email", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "service_accounts_name_key" ON "service_accounts"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_reports_to_fkey" FOREIGN KEY ("reports_to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_parent_sid_fkey" FOREIGN KEY ("parent_sid") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sso_codes" ADD CONSTRAINT "sso_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sso_codes" ADD CONSTRAINT "sso_codes_parent_sid_fkey" FOREIGN KEY ("parent_sid") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ===== Hand-written constraints (spec 04 sections 2 and 5). Prisma cannot express these. =====

-- Only agents have availability and max_clients; max_clients is 1 to 100.
ALTER TABLE "users" ADD CONSTRAINT "users_agent_fields_check"
  CHECK ("role" = 'Agent' OR ("availability" IS NULL AND "max_clients" IS NULL));
ALTER TABLE "users" ADD CONSTRAINT "users_max_clients_range_check"
  CHECK ("max_clients" IS NULL OR ("max_clients" BETWEEN 1 AND 100));

-- Admin has no reports_to; Manager and Agent need one; a user is never their own parent.
-- Client may be null (waiting for an agent).
ALTER TABLE "users" ADD CONSTRAINT "users_reports_to_shape_check"
  CHECK (
    ("role" = 'Admin' AND "reports_to" IS NULL)
    OR ("role" IN ('Manager', 'Agent') AND "reports_to" IS NOT NULL AND "reports_to" <> "id")
    OR "role" = 'Client'
  );

-- waiting_since is for clients without an agent only.
ALTER TABLE "users" ADD CONSTRAINT "users_waiting_since_check"
  CHECK ("waiting_since" IS NULL OR ("role" = 'Client' AND "reports_to" IS NULL));

-- Staff accounts created by Admin carry a lowercase email (citext compares case-insensitively; this keeps stored values lowercase).
ALTER TABLE "users" ADD CONSTRAINT "users_email_lowercase_check"
  CHECK ("email"::text = lower("email"::text));

-- Partial indexes
CREATE INDEX "users_waiting_since_idx" ON "users" ("waiting_since") WHERE "waiting_since" IS NOT NULL;
CREATE INDEX "auth_events_undelivered_idx" ON "auth_events" ("created_at") WHERE "delivered_at" IS NULL;

-- Role/parent consistency: Client under Agent, Agent under Manager, Manager under Admin.
-- Also defaults availability to Available for new agents.
CREATE FUNCTION "users_check_role_parent"() RETURNS trigger AS $$
DECLARE
  parent_role "Role";
  bad_children integer;
BEGIN
  IF NEW."role" = 'Agent' AND NEW."availability" IS NULL THEN
    NEW."availability" := 'Available';
  END IF;

  IF NEW."reports_to" IS NOT NULL THEN
    SELECT "role" INTO parent_role FROM "users" WHERE "id" = NEW."reports_to";
    IF NEW."role" = 'Client'  AND parent_role IS DISTINCT FROM 'Agent'   THEN RAISE EXCEPTION 'Client must report to an Agent'   USING ERRCODE = '23514'; END IF;
    IF NEW."role" = 'Agent'   AND parent_role IS DISTINCT FROM 'Manager' THEN RAISE EXCEPTION 'Agent must report to a Manager'  USING ERRCODE = '23514'; END IF;
    IF NEW."role" = 'Manager' AND parent_role IS DISTINCT FROM 'Admin'   THEN RAISE EXCEPTION 'Manager must report to an Admin' USING ERRCODE = '23514'; END IF;
    IF NEW."role" = 'Admin' THEN RAISE EXCEPTION 'Admin has no reports_to' USING ERRCODE = '23514'; END IF;
  END IF;

  -- Changing a role must not orphan existing children.
  IF TG_OP = 'UPDATE' AND NEW."role" <> OLD."role" THEN
    SELECT count(*) INTO bad_children FROM "users" c
      WHERE c."reports_to" = NEW."id"
        AND NOT ((NEW."role" = 'Agent' AND c."role" = 'Client')
              OR (NEW."role" = 'Manager' AND c."role" = 'Agent')
              OR (NEW."role" = 'Admin' AND c."role" = 'Manager'));
    IF bad_children > 0 THEN RAISE EXCEPTION 'Role change breaks the reports_to chain' USING ERRCODE = '23514'; END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "users_role_parent_trg"
  BEFORE INSERT OR UPDATE OF "role", "reports_to", "availability" ON "users"
  FOR EACH ROW EXECUTE FUNCTION "users_check_role_parent"();

-- An SSO code is only for a Client (spec 04 sso_codes).
CREATE FUNCTION "sso_codes_check_client"() RETURNS trigger AS $$
BEGIN
  IF (SELECT "role" FROM "users" WHERE "id" = NEW."user_id") IS DISTINCT FROM 'Client' THEN
    RAISE EXCEPTION 'SSO codes are for Client users only' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "sso_codes_client_trg"
  BEFORE INSERT OR UPDATE OF "user_id" ON "sso_codes"
  FOR EACH ROW EXECUTE FUNCTION "sso_codes_check_client"();

-- Service accounts: a service key never doubles as a user (separate table, no FK to users) and scopes are never empty.
ALTER TABLE "service_accounts" ADD CONSTRAINT "service_accounts_scopes_check" CHECK (cardinality("scopes") > 0);

-- auth_events type is one of the contract values; version starts at 1.
ALTER TABLE "auth_events" ADD CONSTRAINT "auth_events_type_check"
  CHECK ("type" IN ('user.created','user.updated','user.deactivated','user.reassigned','agent.availability','client.waiting'));
ALTER TABLE "auth_events" ADD CONSTRAINT "auth_events_version_check" CHECK ("version" >= 1);
