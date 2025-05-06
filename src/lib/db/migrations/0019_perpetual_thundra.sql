CREATE TABLE "counties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"country_id" uuid NOT NULL,
	"district_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "counties_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "subcounties" ADD COLUMN "county_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "counties" ADD CONSTRAINT "counties_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counties" ADD CONSTRAINT "counties_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcounties" ADD CONSTRAINT "subcounties_county_id_counties_id_fk" FOREIGN KEY ("county_id") REFERENCES "public"."counties"("id") ON DELETE no action ON UPDATE no action;