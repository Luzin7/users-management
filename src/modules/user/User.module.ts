import { DatabaseModule } from '@infra/databases/Database.module';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '@providers/cryptography/Cryptography.module';
import { DateModule } from '@providers/date/Date.module';
import { DeleteUserController } from './controllers/Delete.controller';
import { GetUserController } from './controllers/GetUser.controller';
import { ListInactivesUsersController } from './controllers/ListInactivesUsers.controller';
import { ListUsersController } from './controllers/ListUsers.controller';
import { LoginUserController } from './controllers/Login.controller';
import { LogoutController } from './controllers/Logout.controller';
import { RefreshTokenController } from './controllers/RefreshToken.controller';
import { CreateUserController } from './controllers/Register.controller';
import { UpdateUserController } from './controllers/UpdateUser.controller';
import { UpdateUserPasswordController } from './controllers/UpdateUserPassword.controller';
import { CreateUserService } from './services/CreateUser.service';
import { DeleteUserService } from './services/DeleteUser.service';
import { FindUserByIdService } from './services/FindUserById.service';
import { ListInactivesUsersService } from './services/ListInactiveUsers.service';
import { ListUsersService } from './services/ListUsers.service';
import { LoginUserService } from './services/LoginUser.service';
import { LogoutService } from './services/Logout.service';
import { RefreshTokenService } from './services/RefreshToken.service';
import { UpdateUserService } from './services/UpdateUser.service';
import { UpdateUserPasswordService } from './services/UpdateUserPassword.service';

@Module({
  controllers: [
    CreateUserController,
    UpdateUserController,
    UpdateUserPasswordController,
    DeleteUserController,
    LoginUserController,
    ListInactivesUsersController,
    GetUserController,
    ListUsersController,
    RefreshTokenController,
    LogoutController,
  ],
  imports: [DatabaseModule, CryptographyModule, DateModule],
  providers: [
    CreateUserService,
    UpdateUserService,
    UpdateUserPasswordService,
    DeleteUserService,
    FindUserByIdService,
    ListInactivesUsersService,
    ListUsersService,
    LoginUserService,
    RefreshTokenService,
    LogoutService,
  ],
})
export class UserModule {}
