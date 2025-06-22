"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const env_1 = require("../../infra/env");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const jwtAuth_guard_1 = require("./guards/jwtAuth.guard");
const jwtStrategy_1 = require("./strategys/jwtStrategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                global: true,
                useFactory() {
                    const privateKey = env_1.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');
                    const publicKey = env_1.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
                    return {
                        signOptions: {
                            algorithm: 'RS256',
                        },
                        privateKey,
                        publicKey,
                    };
                },
            }),
        ],
        providers: [
            jwtStrategy_1.JwtStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: jwtAuth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AuthModule);
