CREATE TABLE "countries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "districts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"country_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "districts_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "parishes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"sub_county_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "parishes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "sub_counties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"district_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "sub_counties_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "villages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"parish_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "villages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "sub_county" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "sub_county" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "no_of_trainings" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "is_active" text DEFAULT 'yes' NOT NULL;--> statement-breakpoint
ALTER TABLE "districts" ADD CONSTRAINT "districts_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parishes" ADD CONSTRAINT "parishes_sub_county_id_sub_counties_id_fk" FOREIGN KEY ("sub_county_id") REFERENCES "public"."sub_counties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_counties" ADD CONSTRAINT "sub_counties_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "villages" ADD CONSTRAINT "villages_parish_id_parishes_id_fk" FOREIGN KEY ("parish_id") REFERENCES "public"."parishes"("id") ON DELETE no action ON UPDATE no action;