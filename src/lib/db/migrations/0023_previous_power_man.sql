CREATE TABLE "cells" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"country_id" uuid NOT NULL,
	"district_id" uuid NOT NULL,
	"county_id" uuid NOT NULL,
	"sub_county_id" uuid NOT NULL,
	"municipality_id" uuid,
	"city_id" uuid,
	"ward_id" uuid,
	"division_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cells_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "cell_id" uuid;--> statement-breakpoint
ALTER TABLE "cells" ADD CONSTRAINT "cells_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cells" ADD CONSTRAINT "cells_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cells" ADD CONSTRAINT "cells_county_id_counties_id_fk" FOREIGN KEY ("county_id") REFERENCES "public"."counties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cells" ADD CONSTRAINT "cells_sub_county_id_subcounties_id_fk" FOREIGN KEY ("sub_county_id") REFERENCES "public"."subcounties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cells" ADD CONSTRAINT "cells_municipality_id_municipalities_id_fk" FOREIGN KEY ("municipality_id") REFERENCES "public"."municipalities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cells" ADD CONSTRAINT "cells_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cells" ADD CONSTRAINT "cells_ward_id_wards_id_fk" FOREIGN KEY ("ward_id") REFERENCES "public"."wards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cells" ADD CONSTRAINT "cells_division_id_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."divisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_cell_id_cells_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cells"("id") ON DELETE no action ON UPDATE no action;