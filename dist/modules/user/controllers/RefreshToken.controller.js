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
exports.RefreshTokenController = void 0;
const Error_presenter_1 = require("../../../infra/presenters/Error.presenter");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const IsPublic_decorator_1 = require("../../../providers/auth/decorators/IsPublic.decorator");
const refreshToken_decorator_1 = require("../../../providers/auth/decorators/refreshToken.decorator");
const statusCode_1 = require("../../../shared/core/types/statusCode");
const Tokens_presenter_1 = require("../presenters/Tokens.presenter");
const RefreshToken_service_1 = require("../services/RefreshToken.service");
let RefreshTokenController = class RefreshTokenController {
    refreshTokenService;
    constructor(refreshTokenService) {
        this.refreshTokenService = refreshTokenService;
    }
    async handle(currentRefreshToken, response) {
        const result = await this.refreshTokenService.execute(currentRefreshToken);
        if (result.isLeft()) {
            return Error_presenter_1.ErrorPresenter.toHTTP(result.value);
        }
        const { accessToken, refreshToken } = result.value;
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        return Tokens_presenter_1.TokensPresenter.toHTTP({ accessToken });
    }
};
exports.RefreshTokenController = RefreshTokenController;
__decorate([
    (0, IsPublic_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(statusCode_1.statusCode.OK),
    __param(0, (0, refreshToken_decorator_1.RefreshToken)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RefreshTokenController.prototype, "handle", null);
exports.RefreshTokenController = RefreshTokenController = __decorate([
    (0, swagger_1.ApiTags)('Autenticação'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [RefreshToken_service_1.RefreshTokenService])
], RefreshTokenController);
