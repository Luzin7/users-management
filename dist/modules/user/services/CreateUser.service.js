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
exports.CreateUserService = void 0;
const common_1 = require("@nestjs/common");
const roles_1 = require("../../../providers/auth/roles");
const HashGenerator_1 = require("../../../providers/cryptography/contracts/HashGenerator");
const Either_1 = require("../../../shared/core/errors/Either");
const User_1 = require("../entities/User");
const EmailAlreadyExistsError_1 = require("../errors/EmailAlreadyExistsError");
const UserRepository_1 = require("../repositories/contracts/UserRepository");
let CreateUserService = class CreateUserService {
    userRepository;
    hashGenerator;
    constructor(userRepository, hashGenerator) {
        this.userRepository = userRepository;
        this.hashGenerator = hashGenerator;
    }
    async execute({ name, email, password, }) {
        const nameAlreadyExists = await this.userRepository.findUniqueByEmail(email);
        if (nameAlreadyExists) {
            return (0, Either_1.left)(new EmailAlreadyExistsError_1.EmailAlreadyExistsError());
        }
        const totalUsers = await this.userRepository.count();
        const role = totalUsers === 0 ? roles_1.Role.Admin : roles_1.Role.User;
        const hashedPassword = await this.hashGenerator.hash(password);
        const user = new User_1.User({
            name,
            email,
            role,
            password: hashedPassword,
        });
        await this.userRepository.create(user);
        return (0, Either_1.right)({
            user,
        });
    }
};
exports.CreateUserService = CreateUserService;
exports.CreateUserService = CreateUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository,
        HashGenerator_1.HashGenerator])
], CreateUserService);
