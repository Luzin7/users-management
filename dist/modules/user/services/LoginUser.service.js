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
exports.LoginUserService = void 0;
const env_1 = require("../../../infra/env");
const common_1 = require("@nestjs/common");
const Encrypter_1 = require("../../../providers/cryptography/contracts/Encrypter");
const HashComparer_1 = require("../../../providers/cryptography/contracts/HashComparer");
const DateAddition_1 = require("../../../providers/date/contracts/DateAddition");
const Either_1 = require("../../../shared/core/errors/Either");
const RefreshToken_1 = require("../entities/RefreshToken");
const WrongCredentialsError_1 = require("../errors/WrongCredentialsError");
const RefreshTokenRepository_1 = require("../repositories/contracts/RefreshTokenRepository");
const UserRepository_1 = require("../repositories/contracts/UserRepository");
let LoginUserService = class LoginUserService {
    userRepository;
    refreshTokensRepository;
    hashComparer;
    encrypter;
    dateAddition;
    constructor(userRepository, refreshTokensRepository, hashComparer, encrypter, dateAddition) {
        this.userRepository = userRepository;
        this.refreshTokensRepository = refreshTokensRepository;
        this.hashComparer = hashComparer;
        this.encrypter = encrypter;
        this.dateAddition = dateAddition;
    }
    async execute({ email, password, }) {
        const user = await this.userRepository.findUniqueByEmail(email);
        if (!user) {
            return (0, Either_1.left)(new WrongCredentialsError_1.WrongCredentialsError());
        }
        const isPasswordValid = await this.hashComparer.compare(password, user.password);
        if (!isPasswordValid) {
            return (0, Either_1.left)(new WrongCredentialsError_1.WrongCredentialsError());
        }
        const accessToken = await this.encrypter.encrypt({
            sub: user.id.toString(),
            role: user.role,
        }, {
            expiresIn: env_1.env.JWT_USER_ACCESS_EXPIRES_IN,
        });
        const _refreshToken = await this.encrypter.encrypt({
            sub: user.id.toString(),
        }, {
            expiresIn: env_1.env.JWT_USER_REFRESH_EXPIRES_IN,
        });
        const refreshToken = new RefreshToken_1.RefreshToken({
            userId: user.id,
            token: _refreshToken,
            expiresIn: this.dateAddition.addDaysInCurrentDate(env_1.env.USER_REFRESH_EXPIRES_IN),
        });
        await this.refreshTokensRepository.create(refreshToken);
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
        return (0, Either_1.right)({
            accessToken,
            refreshToken: refreshToken.token,
            user,
        });
    }
};
exports.LoginUserService = LoginUserService;
exports.LoginUserService = LoginUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository,
        RefreshTokenRepository_1.RefreshTokensRepository,
        HashComparer_1.HashComparer,
        Encrypter_1.Encrypter,
        DateAddition_1.DateAddition])
], LoginUserService);
