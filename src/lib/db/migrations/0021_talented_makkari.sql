ALTER TABLE "organizations" ADD COLUMN "sub_county_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "operation_sub_counties" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "villages" ADD COLUMN "sub_county_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "villages" ADD COLUMN "district_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "villages" ADD COLUMN "county_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "villages" ADD COLUMN "country_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "villages" ADD CONSTRAINT "villages_sub_county_id_subcounties_id_fk" FOREIGN KEY ("sub_county_id") REFERENCES "public"."subcounties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "villages" ADD CONSTRAINT "villages_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "villages" ADD CONSTRAINT "villages_county_id_counties_id_fk" FOREIGN KEY ("county_id") REFERENCES "public"."counties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "villages" ADD CONSTRAINT "villages_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "sub_county";