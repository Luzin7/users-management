export abstract class Repository<T> {
  abstract create(data: T): Promise<void>;
  abstract save(data: T): Promise<void>;
  abstract delete(id: string): Promise<void>;
}

export abstract class RepositoryMapper<T, K, J = K> {
  abstract toDomain(raw: K): T;
  abstract toPersistence(entity: T): J;
}
