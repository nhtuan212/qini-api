-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'REPORT', 'MANAGER', 'STAFF');--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"email" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"role" "role" DEFAULT 'REPORT' NOT NULL,
	"created_at" timestamp(6) DEFAULT now() NOT NULL,
	"updated_at" timestamp(6)
);
--> statement-breakpoint
CREATE TABLE "target" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"target_at" date NOT NULL,
	"created_at" timestamp(6) DEFAULT now() NOT NULL,
	"updated_at" timestamp(6),
	CONSTRAINT "target_target_at_unique" UNIQUE("target_at")
);
--> statement-breakpoint
CREATE TABLE "target_shift" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_id" uuid NOT NULL,
	"shift_id" uuid NOT NULL,
	"cash" real DEFAULT 0 NOT NULL,
	"transfer" real DEFAULT 0 NOT NULL,
	"point" real DEFAULT 0 NOT NULL,
	"deduction" real DEFAULT 0 NOT NULL,
	"revenue" real DEFAULT 0 NOT NULL,
	"description" varchar(255) DEFAULT '',
	"created_at" timestamp(6) DEFAULT now() NOT NULL,
	"updated_at" timestamp(6)
);
--> statement-breakpoint
CREATE TABLE "shift" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kiot_id" varchar(255),
	"name" varchar(255) NOT NULL,
	"start_time" varchar(10),
	"end_time" varchar(10),
	"is_target" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(6) DEFAULT now() NOT NULL,
	"updated_at" timestamp(6)
);
--> statement-breakpoint
CREATE TABLE "time_sheet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_shift_id" uuid NOT NULL,
	"staff_id" uuid NOT NULL,
	"check_in" varchar(10) DEFAULT '',
	"check_out" varchar(10) DEFAULT '',
	"working_hours" real DEFAULT 0 NOT NULL,
	"date" date,
	"created_at" timestamp(6) DEFAULT now() NOT NULL,
	"updated_at" timestamp(6)
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"salary" integer DEFAULT 0 NOT NULL,
	"is_target" boolean DEFAULT false NOT NULL,
	"is_first_login" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"password" varchar(255),
	"created_at" timestamp(6) DEFAULT now() NOT NULL,
	"updated_at" timestamp(6),
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "target_shift" ADD CONSTRAINT "target_shift_target_id_target_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."target"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "target_shift" ADD CONSTRAINT "target_shift_shift_id_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_sheet" ADD CONSTRAINT "time_sheet_target_shift_id_target_shift_id_fk" FOREIGN KEY ("target_shift_id") REFERENCES "public"."target_shift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_sheet" ADD CONSTRAINT "time_sheet_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_staff_target_shift_date" ON "time_sheet" USING btree ("staff_id" date_ops,"target_shift_id" uuid_ops,"date" date_ops);
*/