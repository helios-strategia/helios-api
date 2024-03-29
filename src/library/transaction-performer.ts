import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionPerformer {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  public async perform<T>({
    callback,
    logMeta,
  }: {
    callback: () => Promise<T | undefined> | never;
    logMeta?: Record<string, unknown>;
  }) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const data = await callback();

      await queryRunner.commitTransaction();

      return {
        success: true,
        data,
      };
    } catch (error) {
      Logger.error('TransactionPerformer#perform error', {
        error,
        ...logMeta,
      });

      await queryRunner.rollbackTransaction();

      return {
        success: false,
        error,
      };
    } finally {
      await queryRunner.release();
    }
  }
}
