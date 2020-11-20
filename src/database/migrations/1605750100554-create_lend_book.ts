import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createLendBook1605750100554 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'lend_books',
      columns: [
        {
          name: 'id',
          type: 'integer',
          unsigned: true,
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'book_id',
          type: 'integer',
        },
        {
          name: 'from_user',
          type: 'integer',
        },
        {
          name: 'to_user',
          type: 'integer',
        },
        {
          name: 'lent_at',
          type: 'timestamp',
          default: 'now()'
        },
        {
          name: 'returned_at',
          type: 'timestamp',
          isNullable: true
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('lend_books');
  }
}
