-- Drop the tables that use the enum
DROP TABLE IF EXISTS "organization_members";
DROP TABLE IF EXISTS "users";

-- Drop the enum type
DROP TYPE IF EXISTS "public"."user_role";

-- Create the enum type with all values
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'cluster_manager', 'organization_admin', 'organization_member', 'user');

-- Recreate the users table
CREATE TABLE "users" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "password" text,
  "role" user_role NOT NULL DEFAULT 'user',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Recreate the organization_members table
CREATE TABLE "organization_members" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id"),
  "user_id" text NOT NULL,
  "role" user_role NOT NULL DEFAULT 'organization_member',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
); 