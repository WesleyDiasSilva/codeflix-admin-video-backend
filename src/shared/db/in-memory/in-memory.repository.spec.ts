import { Entity } from "../../domain/entity";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { Uuid } from "../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "./in-memory.repository";

type StubEntityConstructorProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
}

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;
  constructor(props: StubEntityConstructorProps){
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }
  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price
    }
  }
}

class StubInMemory extends InMemoryRepository<StubEntity, Uuid>{
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemory Unit Tests', () => {
  let repo: StubInMemory;

  beforeEach(() => {
    repo = new StubInMemory();
  })
  test('should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'test', price: 100 });
    await repo.insert(entity);
    expect(repo.entities).toHaveLength(1);
    expect(repo.entities[0].name).toBe('test');
    expect(repo.entities[0].price).toBe(100);
  })

  test('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({ name: 'test1', price: 100 }),
      new StubEntity({ name: 'test2', price: 200 }),
    ];
    await repo.bulkInsert(entities);
    expect(repo.entities).toHaveLength(2);
    expect(repo.entities[0].name).toBe('test1');
    expect(repo.entities[0].price).toBe(100);
    expect(repo.entities[1].name).toBe('test2');
    expect(repo.entities[1].price).toBe(200);
  });

  test('should update an entity', async () => {
    const entity = new StubEntity({ name: 'test', price: 100 });
    await repo.insert(entity);
    entity.name = 'updated';
    entity.price = 200;
    await repo.update(entity);
    expect(repo.entities).toHaveLength(1);
    expect(repo.entities[0].name).toBe('updated');
    expect(repo.entities[0].price).toBe(200);
  });

  test('should delete an entity', async () => {
    const entity = new StubEntity({ name: 'test', price: 100 });
    await repo.insert(entity);
    await repo.delete(entity.entity_id);
    expect(repo.entities).toHaveLength(0);
  });

  test('should find all entities', async () => {
    const entities = [
      new StubEntity({ name: 'test1', price: 100 }),
      new StubEntity({ name: 'test2', price: 200 }),
    ];
    await repo.bulkInsert(entities);
    const result = await repo.findAll();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('test1');
    expect(result[0].price).toBe(100);
    expect(result[1].name).toBe('test2');
    expect(result[1].price).toBe(200);
  });

  test('should find an entity by id', async () => {
    const entity = new StubEntity({ name: 'test', price: 100 });
    await repo.insert(entity);
    const result = await repo.findById(entity.entity_id);
    expect(result.name).toBe('test');
    expect(result.price).toBe(100);
  });

  test('should return null when entity do not exists', async () => {
    const entity = new StubEntity({ name: 'test', price: 100 });
    await repo.insert(entity);
    const entity_id = new Uuid();
    const result = await repo.findById(entity_id);
    expect(result).toBeNull();
  });

  test('should throw NotFoundError when updating a non existing entity', async () => {
    const entity = new StubEntity({ name: 'test', price: 100 });
    await expect(repo.update(entity)).rejects.toThrow(NotFoundError);
  });

  test('should throw NotFoundError when deleting a non existing entity', async () => {
    const entity_id = new Uuid();
    await expect(repo.delete(entity_id)).rejects.toThrow(NotFoundError);
  });
});
