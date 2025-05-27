CREATE TABLE "cluster_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cluster_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cluster_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cluster_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "user_role" DEFAULT 'cluster_manager' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "is_permanent_resident" text DEFAULT 'no' NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "are_parents_alive" text DEFAULT 'no' NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "number_of_children" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "employment_status" text DEFAULT 'unemployed' NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "monthly_income" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "main_challenge" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "skill_of_interest" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "expected_impact" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "is_willing_to_participate" text DEFAULT 'yes' NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "cluster_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "cluster_members" ADD CONSTRAINT "cluster_members_cluster_id_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."clusters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cluster_members" ADD CONSTRAINT "cluster_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cluster_users" ADD CONSTRAINT "cluster_users_cluster_id_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."clusters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cluster_users" ADD CONSTRAINT "cluster_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_cluster_id_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."clusters"("id") ON DELETE no action ON UPDATE no action;