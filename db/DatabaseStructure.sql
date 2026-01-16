CREATE TABLE IF NOT EXISTS "factories" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(255) NOT NULL UNIQUE,
	"code" VARCHAR(9) NOT NULL UNIQUE,
	"description" VARCHAR(255) NULL DEFAULT NULL,
	"phone" VARCHAR(20) NULL DEFAULT NULL,
	"location" VARCHAR(255) NULL DEFAULT NULL,
	"status" INTEGER NOT NULL DEFAULT 1,
	"created_by" INTEGER NULL DEFAULT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
	"deleted_at" TIMESTAMP NULL DEFAULT NULL,
	"deleted_by" INTEGER NULL DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL NOT NULL,
	"username" VARCHAR(255) NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"code" VARCHAR(20) NOT NULL,
	"email" VARCHAR(255) NULL DEFAULT NULL,
	"full_name" VARCHAR(255) NULL DEFAULT NULL,
	"date_of_birth" DATE NULL DEFAULT NULL,
	"phone" VARCHAR(20) NULL DEFAULT NULL,
	"status" INTEGER NOT NULL DEFAULT 1,
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"deleted_at" TIMESTAMPTZ NULL DEFAULT NULL,
	"otp_code" VARCHAR(6) NULL DEFAULT NULL,
	"expire" TIMESTAMPTZ NULL DEFAULT NULL,
	"created_by" INTEGER NULL DEFAULT NULL,
	"status_notification" BOOLEAN NULL DEFAULT true,
	PRIMARY KEY ("id"),
	UNIQUE ("username", email, code)
);

CREATE TABLE IF NOT EXISTS "user_factories" (
	"id" SERIAL NOT NULL,
	"user_id" INTEGER NOT NULL,
	"factory_id" INTEGER NOT NULL,
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id", "user_id", "factory_id"),
	CONSTRAINT "FK_Users" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "FK_factories" FOREIGN KEY ("factory_id") REFERENCES "factories" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "permission_settings" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"code" VARCHAR(255) NOT NULL,
	"status" INTEGER NOT NULL DEFAULT 1,
	"group_permission_setting_code" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("code")
);

CREATE TABLE IF NOT EXISTS "group_permission_settings" (
	"id" SERIAL NOT NULL,
	"code" VARCHAR(255) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"status" INTEGER NOT NULL DEFAULT 1,
	PRIMARY KEY ("id"),
	UNIQUE ("code")
);

CREATE TABLE IF NOT EXISTS "user_role_settings" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR NOT NULL,
	"description" VARCHAR NULL DEFAULT NULL,
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"code" VARCHAR(20) NOT NULL,
	"deleted_at" TIMESTAMPTZ NULL DEFAULT NULL,
	"status" INTEGER NOT NULL DEFAULT 1,
	PRIMARY KEY ("id")
);


CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" SERIAL,
	"user_id" INTEGER NOT NULL,
	"user_role_id" INTEGER NOT NULL,
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id", "user_id", "user_role_id"),
	CONSTRAINT "FK_users" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "FK_user_role_settings" FOREIGN KEY ("user_role_id") REFERENCES "user_role_settings" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "user_role_permission_settings" (
	"id" SERIAL,
	"user_role_id" INTEGER NOT NULL,
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"permission_setting_code" VARCHAR(255) NOT NULL,
	"status" INTEGER NULL DEFAULT NULL,
	CONSTRAINT "FK_user_role_settings" FOREIGN KEY ("user_role_id") REFERENCES "user_role_settings" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "FK_permission_settings" FOREIGN KEY ("permission_setting_code") REFERENCES "permission_settings" ("code") ON UPDATE NO ACTION ON DELETE CASCADE
);
