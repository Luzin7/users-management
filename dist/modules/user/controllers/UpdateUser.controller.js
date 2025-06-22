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
exports.UpdateUserController = void 0;
const Error_presenter_1 = require("../../../infra/presenters/Error.presenter");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const CurrentLoggedUser_decorator_1 = require("../../../providers/auth/decorators/CurrentLoggedUser.decorator");
const statusCode_1 = require("../../../shared/core/types/statusCode");
const UpdateUserDTO_1 = require("../dto/UpdateUserDTO");
const UpdateUser_gateway_1 = require("../gateways/UpdateUser.gateway");
const User_presenter_1 = require("../presenters/User.presenter");
const UpdateUser_service_1 = require("../services/UpdateUser.service");
let UpdateUserController = class UpdateUserController {
    updateUserService;
    constructor(updateUserService) {
        this.updateUserService = updateUserService;
    }
    async handle(payload, { name }) {
        const result = await this.updateUserService.execute({
            ...payload,
            name,
        });
        if (result.isLeft()) {
            return Error_presenter_1.ErrorPresenter.toHTTP(result.value);
        }
        const { user } = result.value;
        return User_presenter_1.UserPresenter.toHTTP(user);
    }
};
exports.UpdateUserController = UpdateUserController;
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.HttpCode)(statusCode_1.statusCode.OK),
    __param(0, (0, CurrentLoggedUser_decorator_1.CurrentLoggedUser)()),
    __param(1, (0, common_1.Body)(UpdateUser_gateway_1.UpdateUserGateway)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserDTO_1.UpdateUserDTO]),
    __metadata("design:returntype", Promise)
], UpdateUserController.prototype, "handle", null);
exports.UpdateUserController = UpdateUserController = __decorate([
    (0, swagger_1.ApiTags)('Usuário'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [UpdateUser_service_1.UpdateUserService])
], UpdateUserController);
