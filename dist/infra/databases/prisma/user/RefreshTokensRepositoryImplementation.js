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
exports.RefreshTokensRepositoryImplementation = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const RefreshTokensPrismaMapper_1 = require("./RefreshTokensPrismaMapper");
let RefreshTokensRepositoryImplementation = class RefreshTokensRepositoryImplementation {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const refreshTokens = await this.prisma.refreshToken.findMany();
        return refreshTokens.map(RefreshTokensPrismaMapper_1.RefreshTokensPrismaMapper.toEntity);
    }
    async save(data) {
        await this.prisma.refreshToken.update({
            where: { id: data.id },
            data: RefreshTokensPrismaMapper_1.RefreshTokensPrismaMapper.toPrisma(data),
        });
    }
    async create(refreshToken) {
        await this.prisma.refreshToken.create({
            data: RefreshTokensPrismaMapper_1.RefreshTokensPrismaMapper.toPrisma(refreshToken),
        });
    }
    async findUnique(token) {
        const refreshToken = await this.prisma.refreshToken.findFirst({
            where: {
                token,
            },
        });
        if (refreshToken) {
            return RefreshTokensPrismaMapper_1.RefreshTokensPrismaMapper.toEntity(refreshToken);
        }
        return null;
    }
    async deleteByToken(token) {
        await this.prisma.refreshToken.delete({
            where: { token },
        });
    }
    async delete(id) {
        await this.prisma.refreshToken.delete({
            where: {
                id,
            },
        });
    }
};
exports.RefreshTokensRepositoryImplementation = RefreshTokensRepositoryImplementation;
exports.RefreshTokensRepositoryImplementation = RefreshTokensRepositoryImplementation = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RefreshTokensRepositoryImplementation);
