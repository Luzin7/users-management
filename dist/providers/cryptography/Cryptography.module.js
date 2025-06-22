"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptographyModule = void 0;
const common_1 = require("@nestjs/common");
const Decoder_1 = require("./contracts/Decoder");
const Encrypter_1 = require("./contracts/Encrypter");
const HandleHashGenerator_1 = require("./contracts/HandleHashGenerator");
const HashComparer_1 = require("./contracts/HashComparer");
const HashGenerator_1 = require("./contracts/HashGenerator");
const BcryptHasher_1 = require("./implementations/BcryptHasher");
const CryptoHasher_1 = require("./implementations/CryptoHasher");
const jwtEncrypter_1 = require("./implementations/jwtEncrypter");
let CryptographyModule = class CryptographyModule {
};
exports.CryptographyModule = CryptographyModule;
exports.CryptographyModule = CryptographyModule = __decorate([
    (0, common_1.Module)({
        providers: [
            { provide: Encrypter_1.Encrypter, useClass: jwtEncrypter_1.JwtEncrypter },
            { provide: Decoder_1.Decoder, useClass: jwtEncrypter_1.JwtEncrypter },
            { provide: HashComparer_1.HashComparer, useClass: BcryptHasher_1.BcryptHasher },
            { provide: HashGenerator_1.HashGenerator, useClass: BcryptHasher_1.BcryptHasher },
            { provide: HandleHashGenerator_1.HandleHashGenerator, useClass: CryptoHasher_1.CryptoHasher },
        ],
        exports: [
            Encrypter_1.Encrypter,
            HashComparer_1.HashComparer,
            HashGenerator_1.HashGenerator,
            Decoder_1.Decoder,
            HandleHashGenerator_1.HandleHashGenerator,
        ],
    })
], CryptographyModule);
