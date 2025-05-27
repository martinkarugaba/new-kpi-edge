ALTER TABLE "parishes" ADD COLUMN "district_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "parishes" ADD COLUMN "county_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "parishes" ADD COLUMN "country_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "parishes" ADD CONSTRAINT "parishes_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parishes" ADD CONSTRAINT "parishes_county_id_counties_id_fk" FOREIGN KEY ("county_id") REFERENCES "public"."counties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parishes" ADD CONSTRAINT "parishes_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;