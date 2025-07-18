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
exports.DeleteUserController = void 0;
const Error_presenter_1 = require("../../../infra/presenters/Error.presenter");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const CurrentLoggedUser_decorator_1 = require("../../../providers/auth/decorators/CurrentLoggedUser.decorator");
const roles_decorator_1 = require("../../../providers/auth/decorators/roles.decorator");
const roles_guard_1 = require("../../../providers/auth/guards/roles.guard");
const roles_1 = require("../../../providers/auth/roles");
const statusCode_1 = require("../../../shared/core/types/statusCode");
const DeleteUser_service_1 = require("../services/DeleteUser.service");
let DeleteUserController = class DeleteUserController {
    deleteUserService;
    constructor(deleteUserService) {
        this.deleteUserService = deleteUserService;
    }
    async handle(payload, targetUserId) {
        const result = await this.deleteUserService.execute({
            ...payload,
            targetUserId,
        });
        if (result.isLeft()) {
            return Error_presenter_1.ErrorPresenter.toHTTP(result.value);
        }
    }
};
exports.DeleteUserController = DeleteUserController;
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(statusCode_1.statusCode.NO_CONTENT),
    __param(0, (0, CurrentLoggedUser_decorator_1.CurrentLoggedUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DeleteUserController.prototype, "handle", null);
exports.DeleteUserController = DeleteUserController = __decorate([
    (0, swagger_1.ApiTags)('Administrador'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_1.Role.Admin),
    __metadata("design:paramtypes", [DeleteUser_service_1.DeleteUserService])
], DeleteUserController);
