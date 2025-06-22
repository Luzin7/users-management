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
exports.CreateUserController = void 0;
const Error_presenter_1 = require("../../../infra/presenters/Error.presenter");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const IsPublic_decorator_1 = require("../../../providers/auth/decorators/IsPublic.decorator");
const CreateUserDTO_1 = require("../dto/CreateUserDTO");
const CreateUser_gateway_1 = require("../gateways/CreateUser.gateway");
const User_presenter_1 = require("../presenters/User.presenter");
const CreateUser_service_1 = require("../services/CreateUser.service");
let CreateUserController = class CreateUserController {
    createUserService;
    constructor(createUserService) {
        this.createUserService = createUserService;
    }
    async handle(body) {
        const result = await this.createUserService.execute(body);
        if (result.isLeft()) {
            return Error_presenter_1.ErrorPresenter.toHTTP(result.value);
        }
        const { user } = result.value;
        return User_presenter_1.UserPresenter.toHTTP(user);
    }
};
exports.CreateUserController = CreateUserController;
__decorate([
    (0, IsPublic_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Criar novo usuário',
        description: 'Endpoint para criação de um novo usuário no sistema',
    }),
    (0, swagger_1.ApiBody)({
        type: CreateUserDTO_1.CreateUserDTO,
        description: 'Dados necessários para criar um usuário',
        examples: {
            exemplo1: {
                summary: 'Usuário padrão',
                value: {
                    name: 'João Silva',
                    email: 'joao@email.com',
                    password: 'senha123',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuário criado com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'uuid-gerado' },
                name: { type: 'string', example: 'João Silva' },
                role: { type: 'string', example: 'user' },
                email: { type: 'string', example: 'joao@email.com' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Dados inválidos',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Já existe um usuário com este e-mail cadastrado',
                },
                statusCode: { type: 'number', example: 409 },
            },
        },
    }),
    __param(0, (0, common_1.Body)(CreateUser_gateway_1.CreateUserGateway)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDTO_1.CreateUserDTO]),
    __metadata("design:returntype", Promise)
], CreateUserController.prototype, "handle", null);
exports.CreateUserController = CreateUserController = __decorate([
    (0, swagger_1.ApiTags)('Autenticação'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [CreateUser_service_1.CreateUserService])
], CreateUserController);
