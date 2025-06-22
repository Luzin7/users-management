"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoHasher = void 0;
const crypto_1 = require("crypto");
class CryptoHasher {
    async handleHash() {
        const hash = (0, crypto_1.randomBytes)(64).toString('hex');
        return hash;
    }
}
exports.CryptoHasher = CryptoHasher;
