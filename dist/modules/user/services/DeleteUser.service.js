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
exports.DeleteUserService = void 0;
const common_1 = require("@nestjs/common");
const Either_1 = require("../../../shared/core/errors/Either");
const UserNotFoundError_1 = require("../errors/UserNotFoundError");
const UserRepository_1 = require("../repositories/contracts/UserRepository");
let DeleteUserService = class DeleteUserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute({ targetUserId }) {
        const targetUser = await this.userRepository.findUnique(targetUserId);
        if (!targetUser) {
            return (0, Either_1.left)(new UserNotFoundError_1.UserNotFoundError());
        }
        await this.userRepository.delete(targetUserId);
        return (0, Either_1.right)(null);
    }
};
exports.DeleteUserService = DeleteUserService;
exports.DeleteUserService = DeleteUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository])
], DeleteUserService);
