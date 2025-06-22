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
exports.GetUserController = void 0;
const Error_presenter_1 = require("../../../infra/presenters/Error.presenter");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const CurrentLoggedUser_decorator_1 = require("../../../providers/auth/decorators/CurrentLoggedUser.decorator");
const statusCode_1 = require("../../../shared/core/types/statusCode");
const User_presenter_1 = require("../presenters/User.presenter");
const FindUserById_service_1 = require("../services/FindUserById.service");
let GetUserController = class GetUserController {
    findUserByIdService;
    constructor(findUserByIdService) {
        this.findUserByIdService = findUserByIdService;
    }
    async handle(sub) {
        const result = await this.findUserByIdService.execute(sub);
        if (result.isLeft()) {
            return Error_presenter_1.ErrorPresenter.toHTTP(result.value);
        }
        const { user } = result.value;
        return User_presenter_1.UserPresenter.toHTTP(user);
    }
};
exports.GetUserController = GetUserController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.HttpCode)(statusCode_1.statusCode.OK),
    __param(0, (0, CurrentLoggedUser_decorator_1.CurrentLoggedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GetUserController.prototype, "handle", null);
exports.GetUserController = GetUserController = __decorate([
    (0, swagger_1.ApiTags)('Usuário'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [FindUserById_service_1.FindUserByIdService])
], GetUserController);
