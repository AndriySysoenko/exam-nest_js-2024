import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1739038804574 implements MigrationInterface {
    name = 'Init1739038804574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city" text DEFAULT 'Kyiv'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    }

}
