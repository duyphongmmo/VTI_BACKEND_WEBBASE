import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1697902580075 implements MigrationInterface {
  name = 'Migrations1697902580075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tbl_users table
    await queryRunner.query(
      `CREATE TABLE "tbl_users" (
        "id" SERIAL NOT NULL,
        "email" character varying(255),
        "username" character varying(255) NOT NULL,
        "full_name" character varying(255),
        "password" character varying(255) NOT NULL,
        "code" character varying(20) NOT NULL,
        "phone" character varying(20),
        "status" integer NOT NULL DEFAULT '0',
        "status_notification" boolean NOT NULL DEFAULT true,
        "date_of_birth" date,
        "otp_code" character varying(6),
        "expire" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "created_by" integer,
        "type" integer DEFAULT '1',
        CONSTRAINT "UQ_tbl_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_tbl_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_tbl_users_code" UNIQUE ("code"),
        CONSTRAINT "PK_tbl_users" PRIMARY KEY ("id")
      )`,
    );

    // Create tbl_user_role_settings table
    await queryRunner.query(
      `CREATE TABLE "tbl_user_role_settings" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "code" character varying(20) NOT NULL,
        "description" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "status" integer NOT NULL DEFAULT '1',
        CONSTRAINT "PK_tbl_user_role_settings" PRIMARY KEY ("id")
      )`,
    );

    // Create tbl_user_roles table
    await queryRunner.query(
      `CREATE TABLE "tbl_user_roles" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "user_role_id" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tbl_user_roles" PRIMARY KEY ("id")
      )`,
    );

    // Create junction table for many-to-many relationship
    await queryRunner.query(
      `CREATE TABLE "tbl_users_user_role_settings_tbl_user_role_settings" (
        "tbl_users_id" integer NOT NULL,
        "tbl_user_role_settings_id" integer NOT NULL,
        CONSTRAINT "PK_users_user_role_settings" PRIMARY KEY ("tbl_users_id", "tbl_user_role_settings_id")
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_users_user_role_settings_user" ON "tbl_users_user_role_settings_tbl_user_role_settings" ("tbl_users_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_user_role_settings_role" ON "tbl_users_user_role_settings_tbl_user_role_settings" ("tbl_user_role_settings_id")`,
    );

    // Create tbl_group_permission_settings table
    await queryRunner.query(
      `CREATE TABLE "tbl_group_permission_settings" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "code" character varying(255) NOT NULL,
        "status" integer NOT NULL DEFAULT '1',
        CONSTRAINT "PK_tbl_group_permission_settings_code" PRIMARY KEY ("code")
      )`,
    );

    // Create tbl_permission_settings table
    await queryRunner.query(
      `CREATE TABLE "tbl_permission_settings" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "code" character varying(255) NOT NULL,
        "group_permission_setting_code" character varying(255) NOT NULL,
        "status" integer NOT NULL DEFAULT '1',
        CONSTRAINT "PK_tbl_permission_settings_code" PRIMARY KEY ("code")
      )`,
    );

    // Create tbl_user_role_permission_settings table
    await queryRunner.query(
      `CREATE TABLE "tbl_user_role_permission_settings" (
        "id" SERIAL NOT NULL,
        "user_role_id" integer NOT NULL,
        "permission_setting_code" character varying(255) NOT NULL,
        "status" integer NOT NULL,
        CONSTRAINT "PK_tbl_user_role_permission_settings" PRIMARY KEY ("id")
      )`,
    );

    // Create tbl_mail_history table
    await queryRunner.query(
      `CREATE TABLE "tbl_mail_history" (
        "id" SERIAL NOT NULL,
        "sent_by" integer NOT NULL,
        "sent_to" character varying(255) NOT NULL,
        "cc" character varying,
        "bcc" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "status" integer NOT NULL,
        CONSTRAINT "PK_tbl_mail_history" PRIMARY KEY ("id")
      )`,
    );

    // Create system_log table
    await queryRunner.query(
      `CREATE TABLE "system_log" (
        "id" SERIAL NOT NULL,
        "action" character varying(255),
        "info" text,
        CONSTRAINT "PK_system_log" PRIMARY KEY ("id")
      )`,
    );

    // Add foreign keys
    await queryRunner.query(
      `ALTER TABLE "tbl_user_roles" ADD CONSTRAINT "FK_user_roles_user" 
       FOREIGN KEY ("user_id") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "tbl_permission_settings" ADD CONSTRAINT "FK_permission_group" 
       FOREIGN KEY ("group_permission_setting_code") REFERENCES "tbl_group_permission_settings"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "tbl_users_user_role_settings_tbl_user_role_settings" 
       ADD CONSTRAINT "FK_junction_user" 
       FOREIGN KEY ("tbl_users_id") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "tbl_users_user_role_settings_tbl_user_role_settings" 
       ADD CONSTRAINT "FK_junction_role" 
       FOREIGN KEY ("tbl_user_role_settings_id") REFERENCES "tbl_user_role_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE "tbl_users_user_role_settings_tbl_user_role_settings" DROP CONSTRAINT "FK_junction_role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_users_user_role_settings_tbl_user_role_settings" DROP CONSTRAINT "FK_junction_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_permission_settings" DROP CONSTRAINT "FK_permission_group"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_user_roles" DROP CONSTRAINT "FK_user_roles_user"`,
    );

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_users_user_role_settings_role"`);
    await queryRunner.query(`DROP INDEX "IDX_users_user_role_settings_user"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "system_log"`);
    await queryRunner.query(`DROP TABLE "tbl_mail_history"`);
    await queryRunner.query(`DROP TABLE "tbl_user_role_permission_settings"`);
    await queryRunner.query(`DROP TABLE "tbl_permission_settings"`);
    await queryRunner.query(`DROP TABLE "tbl_group_permission_settings"`);
    await queryRunner.query(
      `DROP TABLE "tbl_users_user_role_settings_tbl_user_role_settings"`,
    );
    await queryRunner.query(`DROP TABLE "tbl_user_roles"`);
    await queryRunner.query(`DROP TABLE "tbl_user_role_settings"`);
    await queryRunner.query(`DROP TABLE "tbl_users"`);
  }
}
