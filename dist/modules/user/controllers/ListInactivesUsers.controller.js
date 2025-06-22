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
exports.ListInactivesUsersController = void 0;
const Error_presenter_1 = require("../../../infra/presenters/Error.presenter");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../providers/auth/decorators/roles.decorator");
const roles_guard_1 = require("../../../providers/auth/guards/roles.guard");
const roles_1 = require("../../../providers/auth/roles");
const ListUserQueryDTO_1 = require("../dto/ListUserQueryDTO");
const User_presenter_1 = require("../presenters/User.presenter");
const ListInactiveUsers_service_1 = require("../services/ListInactiveUsers.service");
let ListInactivesUsersController = class ListInactivesUsersController {
    listInactivesUsersService;
    constructor(listInactivesUsersService) {
        this.listInactivesUsersService = listInactivesUsersService;
    }
    async handle(query) {
        const result = await this.listInactivesUsersService.execute({
            pagination: {
                page: query.page,
                limit: query.limit,
            },
        });
        if (result.isLeft()) {
            return Error_presenter_1.ErrorPresenter.toHTTP(result.value);
        }
        const { users, total, pagination } = result.value;
        return {
            users: users.map(User_presenter_1.UserListPresenter.toHTTP),
            total,
            pagination,
        };
    }
};
exports.ListInactivesUsersController = ListInactivesUsersController;
__decorate([
    (0, common_1.Get)('inactives'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'List inactives users with pagination' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListUserQueryDTO_1.ListUsersQueryDto]),
    __metadata("design:returntype", Promise)
], ListInactivesUsersController.prototype, "handle", null);
exports.ListInactivesUsersController = ListInactivesUsersController = __decorate([
    (0, swagger_1.ApiTags)('Administrador'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_1.Role.Admin),
    __metadata("design:paramtypes", [ListInactiveUsers_service_1.ListInactivesUsersService])
], ListInactivesUsersController);
