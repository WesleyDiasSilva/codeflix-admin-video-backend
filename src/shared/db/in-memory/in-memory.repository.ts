import { Entity } from "../../domain/entity";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { IRepository } from "../../domain/repository/repository-interface";
import { ValueObject } from "../../domain/value-object";


export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject> implements IRepository<E, EntityId>{
  private entities: E[] = [];

  async insert(entity: E): Promise<void> {
    this.entities.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.entities.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const index = this.entities.findIndex((e) => e.entity_id.equals(entity.entity_id));
    if(index === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }
    this.entities[index] = entity;
  }

  async delete(entity_id: EntityId): Promise<void> {
    const index = this.entities.findIndex((e) => e.entity_id.equals(entity_id));
    if(index === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }
    this.entities.splice(index, 1);
  }

  async findAll(): Promise<E[]> {
    return this.entities;
  }

  async findById(entity_id: EntityId): Promise<E> {
    const entity: E = this.entities.find((e) => e.entity_id.equals(entity_id));
    return typeof entity === "undefined" ? null : entity;
  }

  abstract getEntity(): new (...args: any[]) => E;
}