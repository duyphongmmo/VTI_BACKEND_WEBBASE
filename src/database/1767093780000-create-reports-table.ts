import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReportsTable1767093780000 implements MigrationInterface {
  name = 'CreateReportsTable1767093780000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tbl_reports" (
        "id" SERIAL NOT NULL,
        "title" character varying(500) NOT NULL,
        "description" character varying(500),
        "report_type" character varying(100) NOT NULL,
        "report_date" date NOT NULL,
        "factory_id" integer,
        "user_id" integer,
        "total_value" decimal(15,2) DEFAULT 0,
        "quantity" integer DEFAULT 0,
        "status" integer NOT NULL DEFAULT 1,
        "created_by" integer,
        "updated_by" integer,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        CONSTRAINT "PK_reports_id" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tbl_reports"`);
  }
}
