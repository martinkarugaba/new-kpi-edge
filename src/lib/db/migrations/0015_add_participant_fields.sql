ALTER TABLE "participants" ADD COLUMN "no_of_trainings" integer DEFAULT 0 NOT NULL;
ALTER TABLE "participants" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;
