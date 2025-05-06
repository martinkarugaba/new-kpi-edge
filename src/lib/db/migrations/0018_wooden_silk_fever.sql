ALTER TABLE "sub_counties" RENAME TO "subcounties";--> statement-breakpoint
ALTER TABLE "subcounties" DROP CONSTRAINT "sub_counties_code_unique";--> statement-breakpoint
ALTER TABLE "parishes" DROP CONSTRAINT "parishes_sub_county_id_sub_counties_id_fk";
--> statement-breakpoint
ALTER TABLE "subcounties" DROP CONSTRAINT "sub_counties_district_id_districts_id_fk";
--> statement-breakpoint
ALTER TABLE "districts" ADD COLUMN "region" text;--> statement-breakpoint
ALTER TABLE "subcounties" ADD COLUMN "country_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "parishes" ADD CONSTRAINT "parishes_sub_county_id_subcounties_id_fk" FOREIGN KEY ("sub_county_id") REFERENCES "public"."subcounties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcounties" ADD CONSTRAINT "subcounties_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcounties" ADD CONSTRAINT "subcounties_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcounties" ADD CONSTRAINT "subcounties_code_unique" UNIQUE("code");