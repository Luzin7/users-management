"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const Database_module_1 = require("../../infra/databases/Database.module");
const common_1 = require("@nestjs/common");
const Cryptography_module_1 = require("../../providers/cryptography/Cryptography.module");
const Date_module_1 = require("../../providers/date/Date.module");
const Delete_controller_1 = require("./controllers/Delete.controller");
const GetUser_controller_1 = require("./controllers/GetUser.controller");
const ListInactivesUsers_controller_1 = require("./controllers/ListInactivesUsers.controller");
const ListUsers_controller_1 = require("./controllers/ListUsers.controller");
const Login_controller_1 = require("./controllers/Login.controller");
const Logout_controller_1 = require("./controllers/Logout.controller");
const RefreshToken_controller_1 = require("./controllers/RefreshToken.controller");
const Register_controller_1 = require("./controllers/Register.controller");
const UpdateUser_controller_1 = require("./controllers/UpdateUser.controller");
const UpdateUserPassword_controller_1 = require("./controllers/UpdateUserPassword.controller");
const CreateUser_service_1 = require("./services/CreateUser.service");
const DeleteUser_service_1 = require("./services/DeleteUser.service");
const FindUserById_service_1 = require("./services/FindUserById.service");
const ListInactiveUsers_service_1 = require("./services/ListInactiveUsers.service");
const ListUsers_service_1 = require("./services/ListUsers.service");
const LoginUser_service_1 = require("./services/LoginUser.service");
const Logout_service_1 = require("./services/Logout.service");
const RefreshToken_service_1 = require("./services/RefreshToken.service");
const UpdateUser_service_1 = require("./services/UpdateUser.service");
const UpdateUserPassword_service_1 = require("./services/UpdateUserPassword.service");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            Register_controller_1.CreateUserController,
            UpdateUser_controller_1.UpdateUserController,
            UpdateUserPassword_controller_1.UpdateUserPasswordController,
            Delete_controller_1.DeleteUserController,
            Login_controller_1.LoginUserController,
            ListInactivesUsers_controller_1.ListInactivesUsersController,
            GetUser_controller_1.GetUserController,
            ListUsers_controller_1.ListUsersController,
            RefreshToken_controller_1.RefreshTokenController,
            Logout_controller_1.LogoutController,
        ],
        imports: [Database_module_1.DatabaseModule, Cryptography_module_1.CryptographyModule, Date_module_1.DateModule],
        providers: [
            CreateUser_service_1.CreateUserService,
            UpdateUser_service_1.UpdateUserService,
            UpdateUserPassword_service_1.UpdateUserPasswordService,
            DeleteUser_service_1.DeleteUserService,
            FindUserById_service_1.FindUserByIdService,
            ListInactiveUsers_service_1.ListInactivesUsersService,
            ListUsers_service_1.ListUsersService,
            LoginUser_service_1.LoginUserService,
            RefreshToken_service_1.RefreshTokenService,
            Logout_service_1.LogoutService,
        ],
    })
], UserModule);
