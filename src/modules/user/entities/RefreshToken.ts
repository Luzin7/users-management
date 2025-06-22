import { Entity } from '@shared/core/Entities/Entity';
import { Optional } from '@shared/core/types/Optional';
import { RefreshTokenDTO } from '../dto/RefreshTokenDTO';

export class RefreshToken extends Entity<RefreshTokenDTO> {
  constructor(props: Optional<RefreshTokenDTO, 'createdAt'>, id?: string) {
    const refreshTokenProps: RefreshTokenDTO = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };

    super(refreshTokenProps, id);
  }

  get token() {
    return this.props.token;
  }

  get expiresIn() {
    return this.props.expiresIn;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get userId() {
    return this.props.userId;
  }
}
