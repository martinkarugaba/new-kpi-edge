CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"country" text NOT NULL,
	"district" text NOT NULL,
	"sub_county" text NOT NULL,
	"parish" text NOT NULL,
	"village" text NOT NULL,
	"sex" text NOT NULL,
	"age" integer NOT NULL,
	"is_pwd" text DEFAULT 'no' NOT NULL,
	"is_mother" text DEFAULT 'no' NOT NULL,
	"is_refugee" text DEFAULT 'no' NOT NULL,
	"designation" text NOT NULL,
	"enterprise" text NOT NULL,
	"contact" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;