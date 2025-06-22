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
exports.UpdateUserPasswordService = void 0;
const common_1 = require("@nestjs/common");
const HashGenerator_1 = require("../../../providers/cryptography/contracts/HashGenerator");
const Either_1 = require("../../../shared/core/errors/Either");
const UserNotFoundError_1 = require("../errors/UserNotFoundError");
const UserRepository_1 = require("../repositories/contracts/UserRepository");
let UpdateUserPasswordService = class UpdateUserPasswordService {
    userRepository;
    hashGenerator;
    constructor(userRepository, hashGenerator) {
        this.userRepository = userRepository;
        this.hashGenerator = hashGenerator;
    }
    async execute({ sub, password }) {
        const user = await this.userRepository.findUnique(sub);
        if (!user) {
            return (0, Either_1.left)(new UserNotFoundError_1.UserNotFoundError());
        }
        const hashedPassword = await this.hashGenerator.hash(password);
        user.password = hashedPassword;
        await this.userRepository.save(user);
        return (0, Either_1.right)({
            user,
        });
    }
};
exports.UpdateUserPasswordService = UpdateUserPasswordService;
exports.UpdateUserPasswordService = UpdateUserPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository,
        HashGenerator_1.HashGenerator])
], UpdateUserPasswordService);
