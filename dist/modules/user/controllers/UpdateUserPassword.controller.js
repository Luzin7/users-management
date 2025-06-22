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
exports.UpdateUserPasswordController = void 0;
const Error_presenter_1 = require("../../../infra/presenters/Error.presenter");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const CurrentLoggedUser_decorator_1 = require("../../../providers/auth/decorators/CurrentLoggedUser.decorator");
const statusCode_1 = require("../../../shared/core/types/statusCode");
const UpdatePasswordDTO_1 = require("../dto/UpdatePasswordDTO");
const UpdateUserPassword_gateway_1 = require("../gateways/UpdateUserPassword.gateway");
const UpdateUserPassword_service_1 = require("../services/UpdateUserPassword.service");
let UpdateUserPasswordController = class UpdateUserPasswordController {
    updateUserPasswordService;
    constructor(updateUserPasswordService) {
        this.updateUserPasswordService = updateUserPasswordService;
    }
    async handle(payload, { password }) {
        const result = await this.updateUserPasswordService.execute({
            ...payload,
            password,
        });
        if (result.isLeft()) {
            return Error_presenter_1.ErrorPresenter.toHTTP(result.value);
        }
    }
};
exports.UpdateUserPasswordController = UpdateUserPasswordController;
__decorate([
    (0, common_1.Patch)('password'),
    (0, common_1.HttpCode)(statusCode_1.statusCode.NO_CONTENT),
    __param(0, (0, CurrentLoggedUser_decorator_1.CurrentLoggedUser)()),
    __param(1, (0, common_1.Body)(UpdateUserPassword_gateway_1.UpdateUserPasswordGateway)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdatePasswordDTO_1.UpdatePasswordDTO]),
    __metadata("design:returntype", Promise)
], UpdateUserPasswordController.prototype, "handle", null);
exports.UpdateUserPasswordController = UpdateUserPasswordController = __decorate([
    (0, swagger_1.ApiTags)('Usuário'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [UpdateUserPassword_service_1.UpdateUserPasswordService])
], UpdateUserPasswordController);
