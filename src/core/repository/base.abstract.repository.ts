import { BaseInterfaceRepository } from './base.interface.repository';

import { DeleteResult, Repository, UpdateResult } from 'typeorm';

export abstract class BaseAbstractRepository<T>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async create(data: T | any): Promise<T> {
    return await this.entity.save(data);
  }

  public async createMany(data: T[]): Promise<T[]> {
    return await this.entity.save(data);
  }

  public async update(data: T | any): Promise<T> {
    return await this.entity.save(data);
  }

  public async findOneById(id: number): Promise<T> {
    const condition: any = {
      where: { id: id },
    };
    return await this.entity.findOne(condition);
  }

  public async findByCondition(
    filterCondition: any,
    withDeleted = false,
  ): Promise<T[]> {
    return await this.entity.find({
      where: filterCondition,
      withDeleted: withDeleted,
    });
  }

  public async findOneByCondition(condition: any): Promise<T> {
    return await this.entity.findOne({ where: { ...condition } });
  }

  public async findAndCount(filterCondition: any): Promise<any> {
    return await this.entity.findAndCount(filterCondition);
  }

  public async findWithRelations(relations: any): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findOneWithRelations(relations: any): Promise<T> {
    return await this.entity.findOne(relations);
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.find();
  }

  public async remove(id: number): Promise<DeleteResult> {
    return await this.entity.delete(id);
  }

  public async removeByCondition(filterCondition: any): Promise<DeleteResult> {
    return await this.entity.delete(filterCondition);
  }

  public async multipleRemove(ids: number[]): Promise<DeleteResult> {
    return await this.entity.delete(ids);
  }

  public async softDelete(id: number): Promise<UpdateResult> {
    return await this.entity.softDelete(id);
  }
}
