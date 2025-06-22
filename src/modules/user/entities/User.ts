import { Entity } from '@shared/core/Entities/Entity';
import { Optional } from '@shared/core/types/Optional';
import { UserDTO } from '../dto/UserDTO';

export class User extends Entity<UserDTO> {
  constructor(
    props: Optional<
      UserDTO,
      'createdAt' | 'updatedAt' | 'lastLoginAt' | 'role'
    >,
    id?: string,
  ) {
    const userProps: UserDTO = {
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
      lastLoginAt: props.lastLoginAt ?? null,
      name: props.name,
      password: props.password,
      email: props.email,
      role: props.role ?? 'user',
    };

    super(userProps, id);
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get role() {
    return this.props.role;
  }

  set role(role: string) {
    this.props.role = role;
    this.touch();
  }

  get lastLoginAt() {
    return this.props.lastLoginAt;
  }

  set lastLoginAt(lastLoginAt: Date | null) {
    this.props.lastLoginAt = lastLoginAt;
    this.touch();
  }

  touch() {
    this.props.updatedAt = new Date();
  }
}
