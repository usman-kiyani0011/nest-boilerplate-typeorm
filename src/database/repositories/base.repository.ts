import { ConflictException } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  QueryRunner,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { PickKeysByType } from 'typeorm/common/PickKeysByType';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

export abstract class BaseRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  /** Creates a new entity instance and copies all entity properties from this object into a new entity. */
  async create(entity: DeepPartial<T>): Promise<T> {
    try {
      const response = this.repository.create(entity);
      return await this.repository.save(response);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('record already exits.');
      } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new ConflictException('invalid record id');
      }
      throw error;
    }
  }

  /**  Creates new entities and copies all entity properties from given objects into their new entities. */
  async createMany(entities: DeepPartial<T>[]): Promise<T[]> {
    try {
      const response = this.repository.create(entities);
      return await this.repository.save(response);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('record already exits.');
      } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new ConflictException('invalid record id');
      }
      throw error;
    }
  }

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  async save(entity: T, options?: SaveOptions): Promise<T> {
    return this.repository.save(entity, options);
  }

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  async saveMany(entities: T[], options?: SaveOptions): Promise<T[]> {
    return this.repository.save(entities, options);
  }

  /**
   * Finds first entity by a given find options.
   * If entity was not found in the database - returns null.
   */
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  /** Finds entities that match given find options.*/
  async findAll(options?: FindManyOptions<T>) {
    return this.repository.find(options);
  }

  /**
   * Finds entities that match given find options.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  async findAndCount(options?: FindManyOptions<T>) {
    return this.repository.findAndCount(options);
  }

  /**
   * Updates entity partially. Entity can be found by a given conditions.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient UPDATE query.
   * Does not check if entity exist in the database.
   */
  async update(
    options:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<T>,
    entity: QueryDeepPartialEntity<T>,
  ) {
    return await this.repository.update(options, entity);
  }

  /**
   * Inserts a given entity into the database.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient INSERT query.
   * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
   */
  insert(
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    return this.repository.insert(entity);
  }

  /**
   * Inserts a given entity into the database, unless a unique constraint conflicts then updates the entity
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient INSERT ... ON CONFLICT DO UPDATE/ON DUPLICATE KEY UPDATE query.
   */
  async upsert(
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    options: string[] | UpsertOptions<T>,
  ): Promise<InsertResult> {
    return await this.repository.upsert(entity, options);
  }

  /** Counts entities that match given options. */
  async count(options?: FindManyOptions<T>): Promise<number> {
    return await this.repository.count(options);
  }

  /** Return the SUM of a column */
  async sum(
    columnName: PickKeysByType<T, number>,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ) {
    return await this.repository.sum(columnName, where);
  }

  /** Return the AVG of a column */
  async average(
    columnName: PickKeysByType<T, number>,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<number | null> {
    return await this.repository.average(columnName, where);
  }

  /** Return the MIN of a column*/
  async minimum(
    columnName: PickKeysByType<T, number>,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<number | null> {
    return this.repository.minimum(columnName, where);
  }

  /** Return the MAX of a column */
  async maximum(
    columnName: PickKeysByType<T, number>,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<number | null> {
    return await this.repository.maximum(columnName, where);
  }

  /** Increments some column by provided value of the entities matched given conditions.*/
  async increment(
    conditions: FindOptionsWhere<T>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult> {
    return await this.repository.increment(conditions, propertyPath, value);
  }

  /** Decrements some column by provided value of the entities matched given conditions. */
  async decrement(
    conditions: FindOptionsWhere<T>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult> {
    return await this.repository.decrement(conditions, propertyPath, value);
  }

  /** Checks whether any entity exists that matches the given options. */
  async exists(options?: FindManyOptions<T>): Promise<boolean> {
    return await this.repository.exists(options);
  }

  /** Creates a new query builder that can be used to build a SQL query. */
  async queryBuilder(
    alias?: string,
    query?: QueryRunner,
  ): Promise<SelectQueryBuilder<T>> {
    return this.repository.createQueryBuilder(alias, query);
  }

  /**
   * Executes a raw SQL query and returns a raw database results.
   * Raw query execution is supported only by relational databases (MongoDB is not supported).
   */
  async rawQuery(query: string, parameters?: any[]): Promise<any> {
    return await this.repository.query(query, parameters);
  }
}
