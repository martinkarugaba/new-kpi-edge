ALTER TABLE "organizations" DROP CONSTRAINT "organizations_clerk_id_unique";--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "acronym" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "project" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "district" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "sub_county" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "parish" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "village" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "clerk_id";