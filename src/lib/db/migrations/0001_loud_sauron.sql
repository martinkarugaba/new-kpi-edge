ALTER TABLE "clusters" DROP CONSTRAINT "clusters_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "kpis" DROP CONSTRAINT "kpis_cluster_id_clusters_id_fk";
--> statement-breakpoint
ALTER TABLE "clusters" ADD COLUMN "about" text;--> statement-breakpoint
ALTER TABLE "clusters" ADD COLUMN "country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "clusters" ADD COLUMN "districts" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "kpis" ADD COLUMN "unit" text NOT NULL;--> statement-breakpoint
ALTER TABLE "kpis" ADD COLUMN "frequency" text NOT NULL;--> statement-breakpoint
ALTER TABLE "kpis" ADD COLUMN "organization_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "cluster_id" uuid;--> statement-breakpoint
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_cluster_id_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."clusters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clusters" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "clusters" DROP COLUMN "organization_id";--> statement-breakpoint
ALTER TABLE "kpis" DROP COLUMN "cluster_id";