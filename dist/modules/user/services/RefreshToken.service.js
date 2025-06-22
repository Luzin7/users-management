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
exports.RefreshTokenService = void 0;
const env_1 = require("../../../infra/env");
const common_1 = require("@nestjs/common");
const Decoder_1 = require("../../../providers/cryptography/contracts/Decoder");
const Encrypter_1 = require("../../../providers/cryptography/contracts/Encrypter");
const DateAddition_1 = require("../../../providers/date/contracts/DateAddition");
const Either_1 = require("../../../shared/core/errors/Either");
const RefreshToken_1 = require("../entities/RefreshToken");
const SessionExpiredError_1 = require("../errors/SessionExpiredError");
const UserNotFoundError_1 = require("../errors/UserNotFoundError");
const RefreshTokenRepository_1 = require("../repositories/contracts/RefreshTokenRepository");
const UserRepository_1 = require("../repositories/contracts/UserRepository");
let RefreshTokenService = class RefreshTokenService {
    userRepository;
    refreshTokensRepository;
    decrypter;
    encrypter;
    dateAddition;
    constructor(userRepository, refreshTokensRepository, decrypter, encrypter, dateAddition) {
        this.userRepository = userRepository;
        this.refreshTokensRepository = refreshTokensRepository;
        this.decrypter = decrypter;
        this.encrypter = encrypter;
        this.dateAddition = dateAddition;
    }
    async execute(refreshTokenReceived) {
        const { isValid, payload } = await this.decrypter.decrypt(refreshTokenReceived);
        if (!isValid || !payload) {
            return (0, Either_1.left)(new SessionExpiredError_1.SessionExpiredError());
        }
        const id = payload.sub;
        const user = await this.userRepository.findUnique(id);
        if (!user) {
            return (0, Either_1.left)(new UserNotFoundError_1.UserNotFoundError());
        }
        const lastRefreshTokenSaved = await this.refreshTokensRepository.findUnique(refreshTokenReceived);
        if (!lastRefreshTokenSaved) {
            return (0, Either_1.left)(new SessionExpiredError_1.SessionExpiredError());
        }
        await this.refreshTokensRepository.delete(lastRefreshTokenSaved.id);
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
        return (0, Either_1.right)({
            accessToken,
            refreshToken: refreshToken.token,
        });
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository,
        RefreshTokenRepository_1.RefreshTokensRepository,
        Decoder_1.Decoder,
        Encrypter_1.Encrypter,
        DateAddition_1.DateAddition])
], RefreshTokenService);
