import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1739120457948 implements MigrationInterface {
    name = 'Init1739120457948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7c91492fa6749e6d222216fa874"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_7c91492fa6749e6d222216fa874"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshTokenId"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "REL_610102b60fea1455310ccd299d"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "userId" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "REL_610102b60fea1455310ccd299d" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshTokenId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_7c91492fa6749e6d222216fa874" UNIQUE ("refreshTokenId")`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7c91492fa6749e6d222216fa874" FOREIGN KEY ("refreshTokenId") REFERENCES "refresh_tokens"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
