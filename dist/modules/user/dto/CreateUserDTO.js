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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDTO {
    name;
    email;
    password;
}
exports.CreateUserDTO = CreateUserDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome completo do usuário',
        example: 'João Silva',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateUserDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email único do usuário',
        example: 'joao@email.com',
        format: 'email',
        minLength: 5,
        maxLength: 255,
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Senha do usuário',
        example: 'senha123',
        minLength: 6,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateUserDTO.prototype, "password", void 0);
