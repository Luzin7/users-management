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
exports.UserRepositoryImplementation = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const UserMapper_1 = require("./UserMapper");
let UserRepositoryImplementation = class UserRepositoryImplementation {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async count() {
        return this.prisma.user.count();
    }
    async findMany(page, limit, filters, sorting) {
        const where = {};
        if (filters.role) {
            where.role = filters.role;
        }
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        const orderBy = {};
        if (sorting) {
            orderBy[sorting.field] = sorting.order;
        }
        else {
            orderBy.createdAt = 'desc';
        }
        const skip = (page - 1) * limit;
        const take = limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                orderBy,
                skip,
                take,
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users: users.map((user) => UserMapper_1.UserMapper.toEntity(user)),
            total,
        };
    }
    async findInactive(page, limit) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const where = {
            OR: [{ lastLoginAt: null }, { lastLoginAt: { lte: thirtyDaysAgo } }],
        };
        const skip = (page - 1) * limit;
        const take = limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users: users.map((user) => UserMapper_1.UserMapper.toEntity(user)),
            total,
        };
    }
    async findUnique(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        return user ? UserMapper_1.UserMapper.toEntity(user) : null;
    }
    async create(user) {
        await this.prisma.user.create({
            data: UserMapper_1.UserMapper.toPrisma(user),
        });
    }
    async save(user) {
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: UserMapper_1.UserMapper.toPrisma(user),
        });
    }
    async delete(id) {
        await this.prisma.user.delete({
            where: {
                id,
            },
        });
    }
    async findUniqueByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user ? UserMapper_1.UserMapper.toEntity(user) : null;
    }
};
exports.UserRepositoryImplementation = UserRepositoryImplementation;
exports.UserRepositoryImplementation = UserRepositoryImplementation = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepositoryImplementation);
