"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHasher = void 0;
const bcryptjs_1 = require("bcryptjs");
class BcryptHasher {
    async hash(plain) {
        const hashSalt = 10;
        const hashCreated = await (0, bcryptjs_1.hash)(plain, hashSalt);
        return hashCreated;
    }
    async compare(plain, hash) {
        return await (0, bcryptjs_1.compare)(plain, hash);
    }
}
exports.BcryptHasher = BcryptHasher;
