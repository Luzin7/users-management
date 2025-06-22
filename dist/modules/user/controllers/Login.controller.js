"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserController = void 0;
const Error_presenter_1 = require("../../../infra/presenters/Error.presenter");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const IsPublic_decorator_1 = require("../../../providers/auth/decorators/IsPublic.decorator");
const statusCode_1 = require("../../../shared/core/types/statusCode");
const LoginUserDTO_1 = require("../dto/LoginUserDTO");
const LoginUser_gateway_1 = require("../gateways/LoginUser.gateway");
const User_presenter_1 = require("../presenters/User.presenter");
const LoginUser_service_1 = require("../services/LoginUser.service");
let LoginUserController = class LoginUserController {
    loginUserService;
    constructor(loginUserService) {
        this.loginUserService = loginUserService;
    }
    async handle(body, response) {
        const result = await this.loginUserService.execute(body);
        if (result.isLeft()) {
            return Error_presenter_1.ErrorPresenter.toHTTP(result.value);
        }
        const { accessToken, refreshToken, user } = result.value;
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        return User_presenter_1.AuthPresenter.toHTTP(accessToken, user);
    }
};
exports.LoginUserController = LoginUserController;
__decorate([
    (0, IsPublic_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(statusCode_1.statusCode.OK),
    __param(0, (0, common_1.Body)(LoginUser_gateway_1.LoginUserGateway)),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginUserDTO_1.LoginUserDTO, Object]),
    __metadata("design:returntype", Promise)
], LoginUserController.prototype, "handle", null);
exports.LoginUserController = LoginUserController = __decorate([
    (0, swagger_1.ApiTags)('Autenticação'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [LoginUser_service_1.LoginUserService])
], LoginUserController);
